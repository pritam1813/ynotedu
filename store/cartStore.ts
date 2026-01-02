"use client";

import { create } from "zustand";

// Cart item type matching the DB Course model
export interface CartCourse {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    instructorName?: string;
}

interface CartState {
    // Cart courses with full details
    cartCourses: CartCourse[];
    // Loading state
    isLoading: boolean;
    // Error state
    error: string | null;
    // Guest cart IDs (persisted to localStorage)
    guestCartIds: number[];
    // Whether user is authenticated
    isAuthenticated: boolean;
    // Whether client has mounted (for hydration safety)
    hasMounted: boolean;

    // Actions
    setAuthenticated: (isAuth: boolean) => void;
    setHasMounted: (mounted: boolean) => void;
    addCourseToCart: (course: CartCourse) => Promise<void>;
    removeCourseFromCart: (courseId: number) => Promise<void>;
    isAddedToCartCourses: (courseId: number) => boolean;
    fetchCart: () => Promise<void>;
    syncGuestCart: () => Promise<void>;
    clearCart: () => void;
    setCartCourses: (courses: CartCourse[]) => void;
    getTotalPrice: () => number;
}

// Helper to get guest cart from localStorage
const getGuestCart = (): number[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("guest-cart");
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    }
    return [];
};

// Helper to save guest cart to localStorage
const saveGuestCart = (ids: number[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("guest-cart", JSON.stringify(ids));
};

// Helper to clear guest cart from localStorage
const clearGuestCart = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("guest-cart");
};

export const useCartStore = create<CartState>()((set, get) => ({
    cartCourses: [],
    isLoading: false,
    error: null,
    guestCartIds: [],
    isAuthenticated: false,
    hasMounted: false,

    setAuthenticated: (isAuth: boolean) => {
        set({ isAuthenticated: isAuth });
    },

    setHasMounted: (mounted: boolean) => {
        set({ hasMounted: mounted });
    },

    addCourseToCart: async (course: CartCourse) => {
        const { isAuthenticated, cartCourses, guestCartIds } = get();

        // Check if already in cart
        if (cartCourses.some((c) => c.id === course.id)) {
            return;
        }

        if (isAuthenticated) {
            // Add to server cart
            set({ isLoading: true, error: null });
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId: course.id }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to add to cart");
                }

                set((state) => ({
                    cartCourses: [...state.cartCourses, course],
                    isLoading: false,
                }));
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : "Failed to add to cart",
                    isLoading: false,
                });
            }
        } else {
            // Add to guest cart (localStorage)
            const newGuestIds = [...guestCartIds, course.id];
            saveGuestCart(newGuestIds);
            set({
                guestCartIds: newGuestIds,
                cartCourses: [...cartCourses, course],
            });
        }
    },

    removeCourseFromCart: async (courseId: number) => {
        const { isAuthenticated, cartCourses, guestCartIds } = get();

        if (isAuthenticated) {
            set({ isLoading: true, error: null });
            try {
                const response = await fetch(`/api/cart/${courseId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to remove from cart");
                }

                set((state) => ({
                    cartCourses: state.cartCourses.filter((c) => c.id !== courseId),
                    isLoading: false,
                }));
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : "Failed to remove from cart",
                    isLoading: false,
                });
            }
        } else {
            // Remove from guest cart
            const newGuestIds = guestCartIds.filter((id) => id !== courseId);
            saveGuestCart(newGuestIds);
            set({
                guestCartIds: newGuestIds,
                cartCourses: cartCourses.filter((c) => c.id !== courseId),
            });
        }
    },

    isAddedToCartCourses: (courseId: number) => {
        const { cartCourses, hasMounted } = get();
        // Return false during SSR to prevent hydration mismatch
        if (!hasMounted) return false;
        return cartCourses.some((c) => c.id === courseId);
    },

    fetchCart: async () => {
        const { isAuthenticated } = get();

        set({ isLoading: true, error: null });

        if (isAuthenticated) {
            try {
                const response = await fetch("/api/cart");
                if (!response.ok) {
                    throw new Error("Failed to fetch cart");
                }
                const data = await response.json();
                set({
                    cartCourses: data.courses || [],
                    isLoading: false,
                });
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : "Failed to fetch cart",
                    isLoading: false,
                });
            }
        } else {
            // Load guest cart from localStorage and fetch course details
            const guestIds = getGuestCart();
            if (guestIds.length === 0) {
                set({ cartCourses: [], guestCartIds: [], isLoading: false });
                return;
            }

            try {
                // Fetch course details for guest cart items
                const response = await fetch("/api/cart/guest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseIds: guestIds }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch guest cart courses");
                }

                const data = await response.json();
                set({
                    cartCourses: data.courses || [],
                    guestCartIds: guestIds,
                    isLoading: false,
                });
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : "Failed to fetch cart",
                    guestCartIds: guestIds,
                    isLoading: false,
                });
            }
        }
    },

    syncGuestCart: async () => {
        const guestIds = getGuestCart();
        if (guestIds.length === 0) return;

        set({ isLoading: true, error: null });

        try {
            const response = await fetch("/api/cart/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseIds: guestIds }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync cart");
            }

            // Clear guest cart after successful sync
            clearGuestCart();
            set({ guestCartIds: [] });

            // Fetch the updated cart from server
            await get().fetchCart();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to sync cart",
                isLoading: false,
            });
        }
    },

    clearCart: () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
            clearGuestCart();
        }
        set({ cartCourses: [], guestCartIds: [] });
    },

    setCartCourses: (courses: CartCourse[]) => {
        set({ cartCourses: courses });
    },

    getTotalPrice: () => {
        const { cartCourses } = get();
        return cartCourses.reduce((total, course) => total + course.price, 0);
    },
}));

// Legacy exports for backward compatibility with existing components
// These will be removed once all components are updated
export const useStore = () => {
    const store = useCartStore();
    return {
        cartCourses: store.cartCourses.map((c) => ({
            id: c.id,
            title: c.title,
            imageSrc: c.thumbnail,
            discountedPrice: c.price,
            originalPrice: c.price,
            paid: c.price > 0,
            quantity: 1,
        })),
        setCartCourses: (courses: any[]) => {
            store.setCartCourses(
                courses.map((c) => ({
                    id: c.id,
                    title: c.title,
                    thumbnail: c.imageSrc || c.thumbnail,
                    price: c.discountedPrice || c.price,
                    instructorName: c.authorName || c.instructorName,
                }))
            );
        },
        addCourseToCart: async (courseId: number) => {
            // This is a simplified version - fetch course details first
            try {
                const response = await fetch(`/api/courses/${courseId}`);
                if (response.ok) {
                    const course = await response.json();
                    await store.addCourseToCart({
                        id: course.id,
                        title: course.title,
                        thumbnail: course.thumbnail,
                        price: course.price,
                        instructorName: course.instructor?.name,
                    });
                }
            } catch (error) {
                console.error("Failed to add course to cart:", error);
            }
        },
        isAddedToCartCourses: store.isAddedToCartCourses,
        // Legacy stubs for template compatibility (events and shop carts are not implemented)
        cartProducts: [],
        cartEvents: [],
        addEventToCart: (_eventId: number) => {
            console.warn("Event cart is not implemented");
        },
        isAddedToCartEvents: (_eventId: number) => false,
        addProductToCart: (_productId: number) => {
            console.warn("Product cart is not implemented");
        },
        isAddedToCartProducts: (_productId: number) => false,
    };
};
import { create } from "zustand";
import { coursesData } from "@/data/courses";
import { events } from "@/data/events";
import { productData } from "@/data/products";

interface CartItem {
  id: number;
  quantity: number;
  [key: string]: any;
}

interface StoreState {
  // Products
  cartProducts: CartItem[];
  addProductToCart: (id: number) => void;
  isAddedToCartProducts: (id: number) => boolean;
  setCartProducts: (products: CartItem[]) => void;

  // Courses
  cartCourses: CartItem[];
  addCourseToCart: (id: number) => void;
  isAddedToCartCourses: (id: number) => boolean;
  setCartCourses: (courses: CartItem[]) => void;

  // Events
  cartEvents: CartItem[];
  addEventToCart: (id: number) => void;
  isAddedToCartEvents: (id: number) => boolean;
  setCartEvents: (events: CartItem[]) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Products
  cartProducts: [],
  addProductToCart: (id: number) => {
    const { cartProducts } = get();
    if (!cartProducts.find((item) => item.id === id)) {
      const item = {
        ...productData.find((item) => item.id === id),
        quantity: 1,
      };
      set({ cartProducts: [...cartProducts, item] });
    }
  },
  isAddedToCartProducts: (id: number) => {
    const { cartProducts } = get();
    return cartProducts.some((item) => item.id === id);
  },
  setCartProducts: (products: CartItem[]) => set({ cartProducts: products }),

  // Courses
  cartCourses: [],
  addCourseToCart: (id: number) => {
    const { cartCourses } = get();
    if (!cartCourses.find((item) => item.id === id)) {
      const item = {
        ...coursesData.find((item) => item.id === id),
        quantity: 1,
      };
      set({ cartCourses: [...cartCourses, item] });
    }
  },
  isAddedToCartCourses: (id: number) => {
    const { cartCourses } = get();
    return cartCourses.some((item) => item.id === id);
  },
  setCartCourses: (courses: CartItem[]) => set({ cartCourses: courses }),

  // Events
  cartEvents: [],
  addEventToCart: (id: number) => {
    const { cartEvents } = get();
    if (!cartEvents.find((item) => item.id === id)) {
      const item = { ...events.find((item) => item.id === id), quantity: 1 };
      set({ cartEvents: [...cartEvents, item] });
    }
  },
  isAddedToCartEvents: (id: number) => {
    const { cartEvents } = get();
    return cartEvents.some((item) => item.id === id);
  },
  setCartEvents: (events: CartItem[]) => set({ cartEvents: events }),
}));

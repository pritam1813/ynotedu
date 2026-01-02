"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";

interface CartSyncProviderProps {
    children: React.ReactNode;
}

export function CartSyncProvider({ children }: CartSyncProviderProps) {
    const { isSignedIn, isLoaded } = useAuth();
    const { setAuthenticated, setHasMounted, fetchCart, syncGuestCart } = useCartStore();
    const prevSignedIn = useRef<boolean | undefined>(undefined);

    useEffect(() => {
        // Mark as mounted to enable hydration-safe rendering
        setHasMounted(true);

        if (!isLoaded) return;

        // Update auth state in store
        setAuthenticated(!!isSignedIn);

        // If user just signed in (was not signed in before, now is)
        if (prevSignedIn.current === false && isSignedIn) {
            // Sync guest cart to server, then fetch updated cart
            syncGuestCart().then(() => {
                fetchCart();
            });
        } else {
            // Just fetch cart (either guest or authenticated)
            fetchCart();
        }

        prevSignedIn.current = isSignedIn;
    }, [isSignedIn, isLoaded, setAuthenticated, setHasMounted, fetchCart, syncGuestCart]);

    return <>{children}</>;
}

export default CartSyncProvider;

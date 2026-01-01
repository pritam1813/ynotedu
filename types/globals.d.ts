export { };

// Create a type for the roles
export type Roles = "admin" | "instructor" | "student";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }

  // PhonePe Checkout SDK
  interface PhonePeCheckoutOptions {
    tokenUrl: string;
    callback: (response: string) => void;
    type: "IFRAME" | "REDIRECT";
  }

  interface PhonePeCheckout {
    transact: (options: PhonePeCheckoutOptions) => void;
  }

  interface Window {
    PhonePeCheckout?: PhonePeCheckout;
  }
}

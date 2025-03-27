export {};

// Create a type for the roles
export type Roles = "admin" | "instructor" | "student";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

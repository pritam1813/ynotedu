import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  console.log(sessionClaims?.metadata.role);

  return sessionClaims?.metadata.role === role;
};

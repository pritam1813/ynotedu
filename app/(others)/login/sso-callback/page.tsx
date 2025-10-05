import React from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function page() {
  return (
    <>
      <AuthenticateWithRedirectCallback />
      <div id="clerk-captcha" />
    </>
  );
}

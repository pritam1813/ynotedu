import React from "react";
// import PageLinks from '@/components/common/PageLinks'
// import Preloader from "@/components/common/Preloader";
// import FooterOne from '@/components/layout/footers/FooterOne'
// import Header from '@/components/layout/headers/Header'
// import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
// import LoginForm from '@/components/others/LoginForm'
import SignUpForm from "@/components/others/SignUpForm";
// import Terms from '@/components/terms/Terms'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign up || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};
export default async function SignUp() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="main-content  ">
      {/* <Preloader />

      <HeaderAuth /> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          <AuthImageMove />
          <SignUpForm />
        </section>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OAuthStrategy } from "@clerk/types";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    console.log(emailAddress, password);
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      setPasswordError(err.errors[0].message);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <div className="form-page__content lg:py-50">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-8 col-lg-9">
            {pendingVerification ? (
              <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
                <h3 className="text-30 lh-13">Verify Email</h3>
                <p className="mt-10">
                  Please enter the code that was sent to your email address to
                  verify your account.
                </p>
                <form
                  className="contact-form respondForm__form row y-gap-20 pt-30"
                  onSubmit={onPressVerify}
                >
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Code *
                    </label>
                    <input
                      required
                      type="text"
                      name="title"
                      placeholder="Name"
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
                <h3 className="text-30 lh-13">Sign Up</h3>
                <p className="mt-10">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-1">
                    Log in
                  </Link>
                </p>

                <form
                  className="contact-form respondForm__form row y-gap-20 pt-30"
                  onSubmit={handleSubmit}
                >
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Email address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="abc@gmail.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Username *
                    </label>
                    <input
                      required
                      type="text"
                      name="username"
                      placeholder="John765"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Password *
                    </label>
                    <input
                      required
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Confirm Password *
                    </label>
                    <input
                      required
                      type="text"
                      name="ConfirmPassword"
                      placeholder="Retype Password"
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      name="submit"
                      id="submit"
                      className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                    >
                      Register
                    </button>
                  </div>
                </form>

                {/* <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                  Or sign in using
                </div>

                <div className="d-flex x-gap-20 items-center justify-between pt-20">
                  <div>
                    <button className="button -sm px-24 py-20 -outline-blue-3 text-blue-3 text-14">
                      Log In via Facebook
                    </button>
                  </div>
                  <div>
                    <button className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14">
                      Log In via Google
                    </button>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

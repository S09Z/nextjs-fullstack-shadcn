import React from "react";
import { useRouter } from 'next/router'
import Link from "next/link";

const Login = () => {
  const router = useRouter()

  React.useEffect(() => {
    const authTokenExpiration = localStorage.getItem("authTokenExpiration")
    const currentTime = new Date().getTime()

    if (!authTokenExpiration || currentTime > parseInt(authTokenExpiration)) {
      router.push("login")
    }
  }, [])

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-primary py-12 px-8 lg:px-24">
        <div className="flex items-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Acme Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:w-1/2 p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your username and password below to login
            </p>
          </div>
          <form>
            <div className="flex flex-col space-y-2">
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md mt-4"
            >
              Login
            </button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By logging in, you agree to our{" "}
            <Link
              href="/terms" // Add href prop instead of to prop
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy" // Add href prop instead of to prop
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

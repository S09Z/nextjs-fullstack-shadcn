import { useState } from "react";
import usersData from "@/json/users.json";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "../lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/authentication/user-auth-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
}

export default function AuthenticationPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const isAuthenticated = authenticateUser(username, password);
    if (isAuthenticated) {
      toast.success("Login successful!"); // Display success toast message
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to the dashboard after 2 seconds
      }, 2000);
    } else {
      setError("Invalid username or password");
    }
  };


  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
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
            Backoffice
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
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your username and password below to login
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              className="bg-primary text-white py-2 px-4 rounded-md mt-4"
            >
              Login
            </button>
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export function authenticateUser(username: string, password: string) {
  const user = usersData.users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
    localStorage.setItem("authTokenExpiration", JSON.stringify({ user, expirationTime }));
    return true;
  }

  return false;
}

export function isAuthenticated() {
  const authToken = localStorage.getItem("authTokenExpiration");

  if (authToken) {
    const { user, expirationTime } = JSON.parse(authToken);
    if (expirationTime > new Date().getTime()) {
      return user;
    }
    localStorage.removeItem("authTokenExpiration");
  }

  return false;
}

export function logoutUser() {
  localStorage.removeItem("authTokenExpiration");
}
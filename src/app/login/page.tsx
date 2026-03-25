"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const isDisabled = loading || !user.email || !user.password;

  const onLogin = async () => {
    if (!user.email.includes("@")) {
      toast.error("Enter a valid email!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      toast.success(response.data?.message || "User Logged-in successfully.");
      const from = searchParams.get("from");
      const safePath = from && from.startsWith("/") ? from : "/profile";
      router.push(safePath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Login failed!",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Login Page
        </h1>

        <input
          className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
          type="email"
          placeholder="email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <input
          className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
          type={show ? "text" : "password"}
          placeholder="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        <button
          type="button"
          className="text-sm font-medium text-gray-700 hover:underline"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Hide Password" : "Show Password"}
        </button>

        <button
          className={`w-full rounded-lg bg-black py-2 text-white transition ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
          onClick={onLogin}
        >
          {loading ? "Loading ..." : "Login"}
        </button>

        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Create a new account?{" "}
          <Link
            href="/signup"
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Signup
          </Link>
        </p>

        <p className="text-center text-sm">
          <Link
            href="/forgotpassword"
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { SignupFormData, signupSchema } from "@/src/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSignup = async (data: SignupFormData) => {
    try {
      const response = await axios.post("/api/users/signup", data);
      toast.success(response.data?.message || "User registered successfully.");
      reset();
      router.push("/login");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Signup failed",
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Signup Page
        </h1>

        <form onSubmit={handleSubmit(onSignup)} className="space-y-4">
          <div>
            <input
              className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
              type="text"
              placeholder="username"
              // onChange={(e) => setUser({ ...user, username: e.target.value })}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
              type="email"
              placeholder="email"
              // onChange={(e) => setUser({ ...user, email: e.target.value })}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
              type="text"
              placeholder="password"
              // onChange={(e) => setUser({ ...user, password: e.target.value })}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full rounded-lg bg-black py-2 text-white transition ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading ..." : "Signup"}
          </button>
        </form>
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Invalid verification link.");
      return;
    }

    verifyUserEmail();
  }, [token]);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/verifyemail", { token });
      toast.success(response.data?.message || "Email verified successfully.");
      setVerified(true);
      toast.success("Redirecting to login page in 3 seconds ...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Email verification failed! " + error.message;
        toast.error(msg);
      } else {
        toast.error("Something went wrong");
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
        {loading && (
          <p className="text-gray-600 animate-pulse">Verifying your email</p>
        )}

        {!loading && error && <p className="text-red-500">{error}</p>}

        {verified && (
          <>
            <p className="text-green-600 font-medium">
              Email verified successfully 🎉
            </p>

            <Link
              href="/login"
              className="text-black font-medium cursor-pointer hover:underline"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

//    <Suspense fallback={<div>Loading ...</div>}>
//       <LoginPage />
//     </Suspense>

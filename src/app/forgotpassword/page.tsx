"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const isDisabled = loading || !email;

  const onSubmit = async () => {
    if (!email.includes("@")) {
      toast.error("Enter a valid email!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { email });
      toast.success(response.data?.message || "Email sent.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
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
          Forgot Password
        </h1>

        <input
          className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
          placeholder="Enter your email to receive token..."
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className={`w-full rounded-lg bg-black py-2 text-white transition ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
          onClick={onSubmit}
          disabled={isDisabled}
        >
          {loading ? "Sending ..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

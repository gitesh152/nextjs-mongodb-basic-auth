"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isDisabled = loading || !password || !confirmPassword;

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error(`Confirm password does not match!`);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });
      toast.success(response.data?.message || "Reset password successfully.");
      router.push("/login");
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
          Reset Password
        </h1>

        <input
          className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
          placeholder="Enter new password ..."
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full text-gray-900 placeholder:text-gray-400 rounded-md border px-4 py-2 focus:border-black focus:outline-none"
          placeholder="Confirm new password ..."
          type={show ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="button"
          className="text-sm font-medium text-gray-700 hover:underline"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Hide Passwords" : "Show Passwords"}
        </button>

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

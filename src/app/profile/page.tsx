"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [data, setData] = useState("");

  const getUserDetails = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get("/api/users/me");
      setData(response.data.user._id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Fetching user details failed!",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLogoutLoading(true);
      const response = await axios.get("/api/users/logout");
      toast.success(response.data?.message || "Logout successful.");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Log-out failed!",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Profile Page
        </h1>

        <div className="flex gap-3">
          {/* Fetch Button */}
          <button
            onClick={getUserDetails}
            disabled={fetchLoading}
            className="flex-1 rounded-lg bg-black py-2 text-white transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {fetchLoading ? "Loading..." : "Fetch User Details"}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            disabled={logoutLoading}
            className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-red-500 px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-red-600 hover:shadow-md disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {logoutLoading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h2z"
                />
              </svg>
            )}
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
        {data && (
          <p className="text-center text-sm text-gray-600">
            Click here to see details.{" "}
            <Link
              href={`/profile/${data}`}
              className="text-black font-medium cursor-pointer hover:underline"
            >
              View Profile
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

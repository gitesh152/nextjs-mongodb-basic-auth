import { dbConnect } from "@/src/lib/dbConnect";
import { NextResponse } from "next/server";

dbConnect();

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged-out successfully.",
      },
      { status: 200 },
    );
    response.cookies.set("token", "", {
      expires: new Date(),
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong during logout!",
      },
      { status: 500 },
    );
  }
}

import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { dbConnect } from "@/src/lib/dbConnect";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId).select("-password");
    return NextResponse.json({
      success: true,
      message: "User found.",
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong during fetching user!",
      },
      { status: 500 },
    );
  }
}

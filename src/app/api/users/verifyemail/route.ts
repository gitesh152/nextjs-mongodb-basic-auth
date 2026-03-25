import { createHashedToken } from "@/src/helpers/credential.helpers";
import { dbConnect } from "@/src/lib/dbConnect";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token!" },
        { status: 400 },
      );
    }

    const hashedToken = createHashedToken(token);

    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token!" },
        { status: 400 },
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `User email verified successfully.`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "Something went wrong during email verification!",
      },
      {
        status: 500,
      },
    );
  }
}

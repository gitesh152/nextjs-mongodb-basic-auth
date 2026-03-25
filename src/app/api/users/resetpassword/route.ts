import {
  createHashedToken,
  hashPassword,
} from "@/src/helpers/credential.helpers";
import { dbConnect } from "@/src/lib/dbConnect";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    const hashToken = createHashedToken(token);

    const user = await User.findOne({
      forgotPasswordToken: hashToken,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token!" },
        { status: 400 },
      );
    }

    user.password = await hashPassword(password);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `Reset password successful.`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Something went wrong during reset password process!",
      },
      {
        status: 500,
      },
    );
  }
}

import {
  comparePassword,
  createJwtToken,
} from "@/src/helpers/credential.helpers";
import { sendMail } from "@/src/helpers/mailer";
import { dbConnect } from "@/src/lib/dbConnect";
import User from "@/src/models/User";
import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user?.password))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid login credentials!",
        },
        { status: 401 },
      );
    }

    if (!user.isVerified) {
      const isVerificationExpired =
        !user.verifyTokenExpiry ||
        new Date(user.verifyTokenExpiry) < new Date();

      if (isVerificationExpired) {
        await sendMail({
          email: user.email,
          emailType: "VERIFY",
          userId: user._id,
        });

        return NextResponse.json(
          {
            success: false,
            error:
              "Your verification link expired. A new verification email has been sent.",
          },
          { status: 403 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email first.",
        },
        { status: 403 },
      );
    }

    const tokenPayload = { sub: user._id, email: user.email };

    const token = createJwtToken(tokenPayload);

    const response = NextResponse.json(
      {
        success: true,
        message: "User logged-in successfully.",
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong during login!",
      },
      {
        status: 500,
      },
    );
  }
}

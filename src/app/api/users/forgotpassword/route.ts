import { createHashedToken } from "@/src/helpers/credential.helpers";
import { sendMail } from "@/src/helpers/mailer";
import { dbConnect } from "@/src/lib/dbConnect";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 400 });
    }

    // send password reset email

    await sendMail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json(
      {
        success: true,
        message: `Password reset email sent.`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Something went wrong during forgot password process!",
      },
      {
        status: 500,
      },
    );
  }
}

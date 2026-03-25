import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/src/schemas/auth.schemas";
import { hashPassword } from "@/src/helpers/credential.helpers";
import User from "@/src/models/User";
import { sendMail } from "@/src/helpers/mailer";
import { dbConnect } from "@/src/lib/dbConnect";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const result = signupSchema.safeParse(reqBody);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error?.issues[0]?.message || "Validation error!",
        },
        { status: 400 },
      );
    }

    const { username, email, password } = result.data;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const message =
        existingUser.email === email
          ? "Email already registered!"
          : "Username already taken!";
      return NextResponse.json({ message }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // send verification email
    await sendMail({
      email: user.email,
      emailType: "VERIFY",
      userId: user._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: `User registered successfully.`,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong during signup!",
      },
      {
        status: 500,
      },
    );
  }
}

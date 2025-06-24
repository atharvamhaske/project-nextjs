//yaha pe hum user ko register karne ke liye code likhenge kyuki by default next-auth is only for login

import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "email and password are required",
        },
        {
          status: 400,
        }
      );
    }
    await connectToDatabase();

    const existingUSer = await User.findOne({ email });
    if (existingUSer) {
      return NextResponse.json(
        {
          error: "email and password are required",
        },
        {
          status: 400,
        }
      );
    }
    //create user in db
    await User.create({
      email,
      password,
    });
    return NextResponse.json(
      { message: "user successfully created " },
      { status: 400 }
    );
  } catch (error) {

    console.error("registration error", error);
    
    return NextResponse.json(
        {error: "failed to create user and regiser"},
        {status: 400 }
    )
  }
}

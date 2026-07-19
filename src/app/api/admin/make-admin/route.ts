import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    let email = searchParams.get("email");

    // If no email query param, try to get from logged-in session
    if (!email) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.email) {
        email = session.user.email;
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required. Log in or provide ?email=your_email@example.com" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("smart-health-db");
    
    // Check if user exists
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: `User with email ${email} not found in database.` },
        { status: 404 }
      );
    }

    // Update user role to admin
    await db.collection("user").updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    return NextResponse.json({
      success: true,
      message: `User ${email} has been successfully promoted to 'admin'. Please log out and log back in (or refresh session) to apply changes.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to make admin" },
      { status: 500 }
    );
  }
}

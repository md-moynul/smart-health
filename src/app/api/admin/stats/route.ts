import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function GET() {
  try {
    // 1. Authorize session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admins only." },
        { status: 403 }
      );
    }

    // 2. Fetch stats from Backend
    const res = await fetch(`${BACKEND_URL}/api/stats`, {
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load dashboard statistics from backend" },
      { status: 500 }
    );
  }
}

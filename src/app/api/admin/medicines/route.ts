import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admins only." },
        { status: 403 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/products?limit=100`, {
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch medicines from backend" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admins only." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create medicine via backend" },
      { status: 500 }
    );
  }
}

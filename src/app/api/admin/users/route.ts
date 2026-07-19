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

    // 2. Fetch users list from Backend
    const res = await fetch(`${BACKEND_URL}/api/users`, {
      cache: "no-store"
    });
    const users = await res.json();

    // Clean user records before returning
    const cleanedUsers = users.map((u: any) => {
      const { password, ...rest } = u;
      return {
        id: rest.id || rest._id?.toString(),
        name: rest.name || "Unnamed User",
        email: rest.email,
        image: rest.image || "",
        role: rest.role || "user",
        createdAt: rest.createdAt || null,
      };
    });

    return NextResponse.json(cleanedUsers);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users list from backend" },
      { status: 500 }
    );
  }
}

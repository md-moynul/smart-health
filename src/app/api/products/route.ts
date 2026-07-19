import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "8";

    const queryParams = new URLSearchParams();
    if (search) queryParams.set("search", search);
    if (category) queryParams.set("category", category);
    if (sort) queryParams.set("sort", sort);
    queryParams.set("page", page);
    queryParams.set("limit", limit);

    const url = `${BACKEND_URL}/api/products?${queryParams.toString()}`;
    const res = await fetch(url, {
      cache: "no-store"
    });
    
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch from backend" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products from backend API" },
      { status: 500 }
    );
  }
}

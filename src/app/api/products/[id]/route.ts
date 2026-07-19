import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

type Params = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      cache: "no-store"
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Product not found on backend" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product from backend API" },
      { status: 500 }
    );
  }
}

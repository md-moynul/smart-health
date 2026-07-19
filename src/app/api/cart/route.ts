import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// GET: Fetch cart items for the logged-in user
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/api/cart?email=${encodeURIComponent(session.user.email)}`);
  const data = await res.json();
  return NextResponse.json(data);
}

// POST: Add item to cart
export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: session.user.email, productId, quantity }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

// PUT: Update item quantity
export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/cart`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: session.user.email, productId, quantity }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

// DELETE: Remove item from cart
export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { productId } = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/cart`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: session.user.email, productId }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

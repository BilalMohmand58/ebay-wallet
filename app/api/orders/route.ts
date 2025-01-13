// File: app/api/orders/route.ts
import { cookies } from 'next/headers';
import { getOrders } from '../../../lib/ebay';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Await the cookie store
    const cookieStore = await cookies(); // Add `await`
    const token = cookieStore.get('ebay_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const orders = await getOrders(token);
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Orders fetch error:', error);

    const status = error.response?.status || 500;
    const message = status === 401 ? 'Authentication expired' : 'Failed to fetch orders';

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

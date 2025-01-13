import { cookies } from 'next/headers';
import { getOrders } from '../../../lib/ebay';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('ebay_token');

  if (!token) {
    return new Response('Not authenticated', { status: 401 });
  }

  try {
    const orders = await getOrders(token.value);
    return Response.json(orders);
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    const status = error.response?.status || 500;
    const message = status === 401 ? 'Authentication expired' : 'Failed to fetch orders';
    return new Response(message, { status });
  }
}
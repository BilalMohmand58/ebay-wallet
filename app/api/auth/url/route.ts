import { getAuthUrl } from '../../../../lib/ebay';

export async function GET() {
  const url = getAuthUrl();
  return Response.json({ url });
}
import { NextRequest } from 'next/server';
import { getAccessToken } from '../../../../lib/ebay';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No authorization code provided', { status: 400 });
  }

  try {
    const accessToken = await getAccessToken(code);
    const response = new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Location': '/'
      },
      status: 302
    });
    
    response.cookies.set('ebay_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7200,
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}
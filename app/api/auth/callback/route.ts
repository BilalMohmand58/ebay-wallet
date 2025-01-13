// File: app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '../../../../lib/ebay';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken(code);
    
    // Create response using NextResponse
    const response = NextResponse.redirect(new URL('/', request.url), {
      status: 302
    });

    // Set cookie using Next.js cookie API
    response.cookies.set({
      name: 'ebay_token',
      value: accessToken,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7200, // 2 hours
      path: '/'
    });
    
    return response;

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
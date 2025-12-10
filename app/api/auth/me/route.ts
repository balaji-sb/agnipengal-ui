
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  await dbConnect();
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, user: null });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
         return NextResponse.json({ success: false, user: null });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
        return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Auth Check Error:', error);
    return NextResponse.json({ success: false, error: 'Auth check failed' }, { status: 500 });
  }
}

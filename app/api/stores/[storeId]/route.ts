import { NextResponse } from 'next/server';

import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.log('Get Store By ID Error: ', error);

    return NextResponse.json({ store: null });
  }
}

import { NextResponse } from 'next/server';

import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const discounts = await prisma.discount.findMany({
      where: {
        storeId: params.storeId,
        isValid: true,
      },
    });

    return NextResponse.json(discounts);
  } catch (error) {
    console.log('Get Discounts Error: ', error);

    return NextResponse.json([]);
  }
}

import { NextResponse } from 'next/server';

import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        category: { select: { id: true, name: true } },
        attributes: { include: { values: true } },
        variants: {
          include: {
            productAttributeValues: {
              include: { attributeValue: { include: { attribute: true } } },
            },
          },
        },
      },
      orderBy: {
        attributes: {
          _count: 'desc',
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('Get Products Error: ', error);

    return NextResponse.json([]);
  }
}

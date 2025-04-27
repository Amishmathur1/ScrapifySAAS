'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function checkBalance() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthenticated');
  }

  const balance = await prisma.userBalanace.findUnique({
    where: { userId },
  });

  return {
    userId,
    balance,
    hasBalance: !!balance,
    credits: balance?.credits ?? 0
  };
} 
'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function forceUpdateCredits() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthenticated');
  }

  // Delete existing balance if any
  await prisma.userBalanace.deleteMany({
    where: { userId },
  });

  // Create new balance with 10000 credits
  await prisma.userBalanace.create({
    data: {
      userId,
      credits: 10000,
    },
  });

  return { success: true };
} 
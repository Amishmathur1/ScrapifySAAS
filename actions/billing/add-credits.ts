'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function addCredits(amount: number) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthenticated');
  }

  const balance = await prisma.userBalanace.findUnique({
    where: { userId },
  });

  if (!balance) {
    await prisma.userBalanace.create({
      data: { userId, credits: amount },
    });
  } else {
    await prisma.userBalanace.update({
      where: { userId },
      data: { credits: { increment: amount } },
    });
  }

  return { success: true };
} 
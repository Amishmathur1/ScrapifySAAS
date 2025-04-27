'use server';

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

export async function setupUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unautheticated');
  }

  try {
    // First try to delete any existing balance
    await prisma.userBalanace.deleteMany({
      where: { userId },
    });

    // Create new balance with initial credits
    const balance = await prisma.userBalanace.create({
      data: {
        userId,
        credits: 10000,
      },
    });

    console.log('Created balance:', balance);

    return redirect('/');
  } catch (error) {
    console.error('Error setting up user:', error);
    throw error;
  }
}

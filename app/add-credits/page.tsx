'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCredits } from '@/actions/billing/add-credits';

export default function AddCreditsPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddCredits = async () => {
    setLoading(true);
    try {
      await addCredits(10000);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to add credits:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Add Credits</h1>
        <button
          onClick={handleAddCredits}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add 10000 Credits'}
        </button>
      </div>
    </div>
  );
} 
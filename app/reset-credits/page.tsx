'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forceUpdateCredits } from '@/actions/billing/force-update-credits';

export default function ResetCreditsPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetCredits = async () => {
    setLoading(true);
    try {
      await forceUpdateCredits();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to reset credits:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Reset Credits</h1>
        <p className="text-muted-foreground mb-4">This will reset your credits to 10000</p>
        <button
          onClick={handleResetCredits}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Credits'}
        </button>
      </div>
    </div>
  );
} 
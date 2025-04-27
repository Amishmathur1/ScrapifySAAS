'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkBalance } from '@/actions/billing/check-balance';
import { forceUpdateCredits } from '@/actions/billing/force-update-credits';

export default function FixBalancePage() {
  const [loading, setLoading] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkBalance().then(setBalanceInfo);
  }, []);

  const handleFixBalance = async () => {
    setLoading(true);
    try {
      await forceUpdateCredits();
      const newBalance = await checkBalance();
      setBalanceInfo(newBalance);
    } catch (error) {
      console.error('Failed to fix balance:', error);
    }
    setLoading(false);
  };

  if (!balanceInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Fix Balance</h1>
        
        <div className="text-left space-y-2 bg-secondary/50 p-4 rounded">
          <p>User ID: {balanceInfo.userId}</p>
          <p>Has Balance Record: {balanceInfo.hasBalance ? 'Yes' : 'No'}</p>
          <p>Current Credits: {balanceInfo.credits}</p>
        </div>

        <button
          onClick={handleFixBalance}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Fixing...' : 'Fix Balance (Reset to 10000)'}
        </button>

        <button
          onClick={() => router.push('/')}
          className="block w-full bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/90"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
} 
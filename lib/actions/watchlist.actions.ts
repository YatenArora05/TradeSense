
'use server';

import { connectDB } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { getAuth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

async function getUserId(): Promise<string | null> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.id || null;
  } catch (err) {
    console.error('getUserId error:', err);
    return null;
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    await connectDB();
    
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase().trim(),
      company: company.trim(),
      addedAt: new Date(),
    });

    return { success: true };
  } catch (err: any) {
    console.error('addToWatchlist error:', err);
    if (err.code === 11000) {
      return { success: false, error: 'Stock already in watchlist' };
    }
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    await connectDB();
    
    const result = await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase().trim(),
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Stock not found in watchlist' };
    }

    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}

export async function isStockInWatchlist(symbol: string): Promise<boolean> {
  try {
    const userId = await getUserId();
    if (!userId) return false;

    await connectDB();
    
    const item = await Watchlist.findOne({
      userId,
      symbol: symbol.toUpperCase().trim(),
    }).lean();

    return !!item;
  } catch (err) {
    console.error('isStockInWatchlist error:', err);
    return false;
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Transaction from '@/models/Transaction';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map(u => u._id);

    const [totalUsers, totalChats, totalTransactions, auStats, spendStats] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Chat.countDocuments({ userId: { $nin: adminIds } }),
      Transaction.countDocuments({ userId: { $nin: adminIds } }),
      User.aggregate([
        { $match: { role: { $ne: 'admin' } } },
        { $group: { _id: null, total: { $sum: '$au' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: { $nin: adminIds }, type: 'SPEND' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    // Real health checks: database round trip, answers in the last 24 hours, last answer time,
    // and whether the AI key is configured.
    const pingStart = Date.now();
    let dbOk = true;
    try { await mongoose.connection.db.admin().command({ ping: 1 }); } catch { dbOk = false; }
    const dbPingMs = Date.now() - pingStart;
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [answers24h, lastAnswer] = await Promise.all([
      Transaction.countDocuments({ type: 'SPEND', createdAt: { $gte: dayAgo } }),
      Transaction.findOne({ type: 'SPEND' }).sort({ createdAt: -1 }).select('createdAt').lean(),
    ]);

    const totalLeft = auStats[0]?.total || 0;
    const totalSpent = spendStats[0]?.total || 0;
    const totalTokens = totalLeft + totalSpent;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalChats,
        totalTransactions,
        totalLeft,
        totalSpent,
        totalRecharged: totalTokens,
      },
      health: {
        dbOk,
        dbPingMs,
        aiConfigured: !!process.env.OPENROUTER_API_KEY,
        answers24h,
        lastAnswerAt: lastAnswer?.createdAt || null,
      }
    });
  } catch (error) {
    console.error('[GET /api/admin/stats] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

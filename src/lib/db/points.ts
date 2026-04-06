import { createClient } from '@/lib/supabase/client';

export interface DBReward {
  id: string;
  title: string;
  description: string | null;
  points_required: number;
  category: 'Merchandise' | 'Experience';
  icon: string | null;
  badge: string | null;
  value_label: string | null;
  fields_type: 'merch' | 'experience';
  sort_order: number;
}

export interface RedemptionInput {
  userId: string;
  rewardId: string;
  pointsSpent: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  // merch
  size?: string;
  shippingAddress?: string;
  // experience
  preferredDate?: string;
  guests?: number;
}

export async function getRewards(): Promise<DBReward[]> {
  const { data, error } = await createClient()
    .from('rewards')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getRewards error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getUserPoints(userId: string): Promise<number> {
  const { data } = await createClient()
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();
  return data?.points ?? 0;
}

export async function getUserRedemptions(userId: string): Promise<string[]> {
  const { data } = await createClient()
    .from('redemptions')
    .select('reward_id')
    .eq('user_id', userId)
    .not('status', 'eq', 'cancelled');
  return (data ?? []).map((r: { reward_id: string }) => r.reward_id);
}

export async function createRedemption(input: RedemptionInput): Promise<boolean> {
  // 1. Insert redemption record
  const { error: redError } = await createClient().from('redemptions').insert({
    user_id: input.userId,
    reward_id: input.rewardId,
    code: input.code,
    status: 'pending',
    points_spent: input.pointsSpent,
    name: input.name,
    phone: input.phone,
    email: input.email,
    size: input.size ?? null,
    shipping_address: input.shippingAddress ?? null,
    preferred_date: input.preferredDate ?? null,
    guests: input.guests ?? null,
  });

  if (redError) {
    console.error('createRedemption error:', redError.message);
    return false;
  }

  // 2. Deduct points ledger
  await createClient().from('points_ledger').insert({
    user_id: input.userId,
    amount: -input.pointsSpent,
    type: 'redemption',
    description: `Redeemed reward — code ${input.code}`,
  });

  // 3. Update profile points balance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (createClient() as any).rpc('increment_points', { p_user_id: input.userId, p_amount: -input.pointsSpent });

  // 4. Decrement reward stock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (createClient() as any).rpc('decrement_reward_stock', { p_reward_id: input.rewardId });

  return true;
}

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
import type { CartItem } from '@/lib/cart';

export interface CreateMerchandiseOrderInput {
  userId: string;
  items: CartItem[];
  subtotal: number; // merchandise only, used for points (excludes shipping)
  total: number;    // grand total including shipping, stored on the order
  paymentMethod: 'fpx' | 'card';
  cardName?: string;
}

export async function createMerchandiseOrder(input: CreateMerchandiseOrderInput): Promise<string | null> {
  const pointsEarned = Math.floor(input.subtotal * 2); // 2 pts per RM1, shipping excluded

  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      status: 'completed',
      type: 'merchandise',
      total: input.total,
      points_earned: pointsEarned,
      notes: `Payment: ${input.paymentMethod === 'card' ? `Card (${input.cardName})` : 'FPX'}`,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('createMerchandiseOrder error:', orderError?.message);
    return null;
  }

  // 2. Create order items
  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
    size: item.size,
  }));
  await supabase.from('order_items').insert(orderItems);

  // 3. Add points to ledger
  await supabase.from('points_ledger').insert({
    user_id: input.userId,
    amount: pointsEarned,
    type: 'purchase',
    description: `Merchandise order — ${input.items.length} item(s)`,
    reference_id: order.id,
  });

  // 4. Update profile points balance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('increment_points', { p_user_id: input.userId, p_amount: pointsEarned });

  return order.id;
}

export interface CreateTopupOrderInput {
  userId: string;
  gameId: string;
  packageId: string;
  gameName: string;
  packageAmount: string;
  price: number;
  gameUserId: string;
}

export async function createTopupOrder(input: CreateTopupOrderInput): Promise<string | null> {
  const pointsEarned = Math.floor(input.price);

  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      status: 'completed',
      type: 'topup',
      total: input.price,
      points_earned: pointsEarned,
      game_user_id: input.gameUserId,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('createTopupOrder error:', orderError?.message);
    return null;
  }

  // 2. Create order item
  await supabase.from('order_items').insert({
    order_id: order.id,
    game_id: input.gameId,
    package_id: input.packageId,
    quantity: 1,
    unit_price: input.price,
  });

  // 3. Add points to ledger
  await supabase.from('points_ledger').insert({
    user_id: input.userId,
    amount: pointsEarned,
    type: 'purchase',
    description: `Top up ${input.gameName} — ${input.packageAmount}`,
    reference_id: order.id,
  });

  // 4. Update profile points balance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('increment_points', { p_user_id: input.userId, p_amount: pointsEarned });

  return order.id;
}

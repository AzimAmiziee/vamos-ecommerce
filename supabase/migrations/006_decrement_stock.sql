-- Atomically decrement reward stock by 1 (only if stock > 0)
create or replace function decrement_reward_stock(p_reward_id uuid)
returns void language sql security definer as $$
  update public.rewards
  set stock = stock - 1
  where id = p_reward_id and stock > 0;
$$;

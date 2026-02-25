export interface User {
  id: number;
  username: string;
  email: string | null;
  points: number;
  is_amulya: boolean;
  created_at: string;
}

export interface Reward {
  id: number;
  title: string;
  label: string;
  cost: number;
  emoji: string | null;
  image: string | null;
  gradient: string | null;
  description: string | null;
  amulya_only: boolean;
  sort_order: number;
}

export interface Redemption {
  id: number;
  reward_id: number;
  quantity: number;
  total_cost: number;
  redeemed_at: string;
}

export interface RedeemResponse {
  redemption: Redemption;
  new_points: number;
}

export interface RedemptionHistoryItem {
  id: number;
  reward_label: string;
  reward_emoji: string | null;
  quantity: number;
  total_cost: number;
  redeemed_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

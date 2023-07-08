/* eslint-disable @typescript-eslint/naming-convention */

/* Player (faceit api response) */
export type PlayerApiResponse = {
  id: string;
  activated_at: string;
  active_team_id: string;
  avatar: string;
  birthdate: {
    date: string;
    month: string;
    year: string;
  };
  country: string;
  cover_image_url: string;
  created_at: string;
  created_by: string;
  email: string;
  email_verified: boolean;
  faceit_points: number;
  firstname: string;
  lastname: string;
  nickname: string;
  flag: string;
  friends: string[];
  games: {
    [key: string]: {
      game_id: string;
      game_name: string;
      faceit_elo: number;
      region: string;
      region_updated_at: string;
      skill_level: number;
      skill_level_label: string;
      tags: string[];
      elo_refreshed_by_user_at: string;
    };
  };
  geolocation: {
    country_code: string;
  };
  guest_info: {
    [key: string]: string;
  };
  memberships: string[];
  mfa: string[];
  pending_friend_requests: {
    date: string;
    user_id: string;
  }[];
  pending_friendship_requests: string[];
  pending_team_requests: string[];
  phone: string;
  phone_verified: boolean;
  registration_status: string;
  roles: string[];
  settings: {
    [key: string]: string;
  };
  status: string;
  tags: string[];
  updated_at: string;
  updated_by: string;
  user_type: string;
  version: number;
  platforms: {
    [key: string]: {
      id: string;
      nickname: string;
      id64: string;
    };
  };
  newsletter_marketing: {
    product_updates: boolean;
    tips: boolean;
    news: boolean;
    promotions: boolean;
  };
};

/* Player (faceit open api response) */
export type PlayerOpenResponse = {
  avatar: string;
  country: string;
  cover_featured_image: string;
  cover_image: string;
  faceit_url: string;
  friends_ids: string[];
  games: {
    [key: string]: {
      faceit_elo: number;
      game_player_id: string;
      game_player_name: string;
      game_profile_id: string;
      region: string;
      regions: string;
      skill_level: number;
      skill_level_label: string;
    };
  };
  infractions: Record<string, string>;
  membership_type: string;
  memberships: string[];
  new_steam_id: string;
  nickname: string;
  platforms: Record<string, string>;
  player_id: string;
  settings: {
    language: string;
  };
  steam_id_64: string;
  steam_nickname: string;
};

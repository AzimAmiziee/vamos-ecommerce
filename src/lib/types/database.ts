export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          original_price: number | null;
          image: string | null;
          hover_image: string | null;
          category: string;
          collection: string | null;
          description: string | null;
          sizes: string[];
          rating: number;
          in_stock: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      games: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_name: string;
          currency: string;
          color: string;
          color_secondary: string;
          image: string | null;
          category: 'Mobile Game' | 'PC Game' | 'Voucher';
          description: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['games']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['games']['Insert']>;
      };
      game_packages: {
        Row: {
          id: string;
          game_id: string;
          package_key: string;
          amount: string;
          price: number;
          bonus: string | null;
          popular: boolean;
          active: boolean;
          sort_order: number;
        };
        Insert: Omit<Database['public']['Tables']['game_packages']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['game_packages']['Insert']>;
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          paragraphs: string[];
          cover_image: string | null;
          category: 'Match Report' | 'Team News' | 'Merchandise' | 'Community';
          author: string;
          read_time: number;
          published: boolean;
          published_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
      standings: {
        Row: {
          id: string;
          season: string;
          week: number | null;
          rank: number;
          team: string;
          match_wins: number;
          match_losses: number;
          game_wins: number;
          game_losses: number;
          points: number;
          is_vamos: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['standings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['standings']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          type: 'merchandise' | 'topup';
          total: number;
          points_earned: number;
          game_user_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          game_id: string | null;
          package_id: string | null;
          quantity: number;
          unit_price: number;
          size: string | null;
          metadata: Record<string, unknown> | null;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      points_ledger: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'redemption' | 'bonus' | 'adjustment';
          description: string | null;
          reference_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['points_ledger']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['points_ledger']['Insert']>;
      };
      rewards: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          points_required: number;
          category: 'Merchandise' | 'Experience';
          icon: string | null;
          badge: string | null;
          value_label: string | null;
          fields_type: 'merch' | 'experience';
          active: boolean;
          stock: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rewards']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['rewards']['Insert']>;
      };
      redemptions: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          code: string;
          status: 'pending' | 'processing' | 'completed' | 'cancelled';
          points_spent: number;
          name: string | null;
          phone: string | null;
          email: string | null;
          size: string | null;
          shipping_address: string | null;
          preferred_date: string | null;
          guests: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['redemptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['redemptions']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          status: 'new' | 'read' | 'replied';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
    };
  };
}

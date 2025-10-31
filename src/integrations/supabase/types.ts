export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      brochure_downloads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          request_type: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          request_type?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          request_type?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      funds: {
        Row: {
          aum: number
          created_at: string
          fund_name: string
          id: string
          irr: number
          strategy: string
          tvpi: number
          updated_at: string
        }
        Insert: {
          aum: number
          created_at?: string
          fund_name: string
          id?: string
          irr: number
          strategy: string
          tvpi: number
          updated_at?: string
        }
        Update: {
          aum?: number
          created_at?: string
          fund_name?: string
          id?: string
          irr?: number
          strategy?: string
          tvpi?: number
          updated_at?: string
        }
        Relationships: []
      }
      network_profiles: {
        Row: {
          account_type: string
          avatar_url: string | null
          company: string | null
          created_at: string
          description: string | null
          email: string
          funding_amount: string | null
          funding_stage: string | null
          geographic_focus: string | null
          id: string
          investment_range: string | null
          investment_stage: string | null
          linkedin: string | null
          name: string
          pitch_deck: string | null
          portfolio_size: string | null
          profile_complete: boolean | null
          revenue: string | null
          sector: string | null
          team_size: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          account_type: string
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          description?: string | null
          email: string
          funding_amount?: string | null
          funding_stage?: string | null
          geographic_focus?: string | null
          id?: string
          investment_range?: string | null
          investment_stage?: string | null
          linkedin?: string | null
          name: string
          pitch_deck?: string | null
          portfolio_size?: string | null
          profile_complete?: boolean | null
          revenue?: string | null
          sector?: string | null
          team_size?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          account_type?: string
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          description?: string | null
          email?: string
          funding_amount?: string | null
          funding_stage?: string | null
          geographic_focus?: string | null
          id?: string
          investment_range?: string | null
          investment_stage?: string | null
          linkedin?: string | null
          name?: string
          pitch_deck?: string | null
          portfolio_size?: string | null
          profile_complete?: boolean | null
          revenue?: string | null
          sector?: string | null
          team_size?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          subscribed?: boolean
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          bank_reference: string | null
          created_at: string
          currency: string
          id: string
          payment_method: string
          product_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          bank_reference?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string
          product_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string
          product_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sent_newsletters: {
        Row: {
          content: string
          created_at: string
          cta_link: string | null
          cta_text: string | null
          failed_sends: number
          heading: string
          id: string
          preheader: string | null
          recipients_count: number
          sent_at: string
          sent_by: string | null
          subject: string
          successful_sends: number
        }
        Insert: {
          content: string
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          failed_sends?: number
          heading: string
          id?: string
          preheader?: string | null
          recipients_count?: number
          sent_at?: string
          sent_by?: string | null
          subject: string
          successful_sends?: number
        }
        Update: {
          content?: string
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          failed_sends?: number
          heading?: string
          id?: string
          preheader?: string | null
          recipients_count?: number
          sent_at?: string
          sent_by?: string | null
          subject?: string
          successful_sends?: number
        }
        Relationships: []
      }
      stocks: {
        Row: {
          beta: number
          created_at: string
          dividend_yield: number
          id: string
          market_cap: number
          name: string
          pe_ratio: number
          price: number
          sector: string
          ticker: string
          updated_at: string
          volume: number
        }
        Insert: {
          beta: number
          created_at?: string
          dividend_yield: number
          id?: string
          market_cap: number
          name: string
          pe_ratio: number
          price: number
          sector: string
          ticker: string
          updated_at?: string
          volume: number
        }
        Update: {
          beta?: number
          created_at?: string
          dividend_yield?: number
          id?: string
          market_cap?: number
          name?: string
          pe_ratio?: number
          price?: number
          sector?: string
          ticker?: string
          updated_at?: string
          volume?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

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
      abc_investor_activities: {
        Row: {
          activity_date: string
          activity_description: string
          activity_type: string
          created_at: string
          created_by: string
          id: string
          investor_name: string
        }
        Insert: {
          activity_date?: string
          activity_description: string
          activity_type: string
          created_at?: string
          created_by: string
          id?: string
          investor_name: string
        }
        Update: {
          activity_date?: string
          activity_description?: string
          activity_type?: string
          created_at?: string
          created_by?: string
          id?: string
          investor_name?: string
        }
        Relationships: []
      }
      abc_investor_documents: {
        Row: {
          document_name: string
          document_type: string
          document_url: string | null
          id: string
          investor_name: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          document_name: string
          document_type: string
          document_url?: string | null
          id?: string
          investor_name: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          document_name?: string
          document_type?: string
          document_url?: string | null
          id?: string
          investor_name?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      abc_investor_followups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          follow_up_date: string
          follow_up_type: string
          id: string
          investor_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          follow_up_date: string
          follow_up_type: string
          id?: string
          investor_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          follow_up_date?: string
          follow_up_type?: string
          id?: string
          investor_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      abc_investor_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          investor_name: string
          note_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          investor_name: string
          note_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          investor_name?: string
          note_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      abc_investors: {
        Row: {
          approval_status: string
          azienda: string
          categoria: string
          citta: string | null
          created_at: string
          email: string | null
          expected_close: string | null
          fonte: string | null
          id: string
          last_contact_date: string | null
          linkedin: string | null
          next_follow_up_date: string | null
          nome: string
          phone: string | null
          pipeline_value: number
          priorita: string | null
          probability: number | null
          relationship_owner: string | null
          rilevanza: string | null
          ruolo: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          azienda: string
          categoria: string
          citta?: string | null
          created_at?: string
          email?: string | null
          expected_close?: string | null
          fonte?: string | null
          id?: string
          last_contact_date?: string | null
          linkedin?: string | null
          next_follow_up_date?: string | null
          nome: string
          phone?: string | null
          pipeline_value?: number
          priorita?: string | null
          probability?: number | null
          relationship_owner?: string | null
          rilevanza?: string | null
          ruolo?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          azienda?: string
          categoria?: string
          citta?: string | null
          created_at?: string
          email?: string | null
          expected_close?: string | null
          fonte?: string | null
          id?: string
          last_contact_date?: string | null
          linkedin?: string | null
          next_follow_up_date?: string | null
          nome?: string
          phone?: string | null
          pipeline_value?: number
          priorita?: string | null
          probability?: number | null
          relationship_owner?: string | null
          rilevanza?: string | null
          ruolo?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_bookings: {
        Row: {
          client_type: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          contact_role: string
          created_at: string
          fundraising_target: string
          id: string
          key_metrics: string | null
          lp_preferences: string | null
          materials: string | null
          status: string
          timeline: string
          updated_at: string
        }
        Insert: {
          client_type: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          contact_role: string
          created_at?: string
          fundraising_target: string
          id?: string
          key_metrics?: string | null
          lp_preferences?: string | null
          materials?: string | null
          status?: string
          timeline: string
          updated_at?: string
        }
        Update: {
          client_type?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          contact_role?: string
          created_at?: string
          fundraising_target?: string
          id?: string
          key_metrics?: string | null
          lp_preferences?: string | null
          materials?: string | null
          status?: string
          timeline?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      contact_inquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message: string
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      content_distributions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          updated_at: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          updated_at?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          updated_at?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
      distribution_logs: {
        Row: {
          content_title: string
          content_url: string
          distributed_at: string | null
          id: string
          metadata: Json | null
          platform: string
          status: string | null
        }
        Insert: {
          content_title: string
          content_url: string
          distributed_at?: string | null
          id?: string
          metadata?: Json | null
          platform: string
          status?: string | null
        }
        Update: {
          content_title?: string
          content_url?: string
          distributed_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string
          status?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          campaign_name: string
          content: string
          created_at: string
          failed_sends: number
          filter_intermediary: string | null
          filter_region: string | null
          id: string
          recipient_count: number
          sent_at: string | null
          sent_by: string | null
          status: string
          subject: string
          successful_sends: number
        }
        Insert: {
          campaign_name: string
          content: string
          created_at?: string
          failed_sends?: number
          filter_intermediary?: string | null
          filter_region?: string | null
          id?: string
          recipient_count?: number
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject: string
          successful_sends?: number
        }
        Update: {
          campaign_name?: string
          content?: string
          created_at?: string
          failed_sends?: number
          filter_intermediary?: string | null
          filter_region?: string | null
          id?: string
          recipient_count?: number
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject?: string
          successful_sends?: number
        }
        Relationships: []
      }
      financial_advisers: {
        Row: {
          age: number | null
          birth_date: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string
          full_name: string
          id: string
          intermediary: string | null
          last_name: string
          linkedin_url: string | null
          phone: string | null
          portfolio: string | null
          province: string | null
          region: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          full_name: string
          id?: string
          intermediary?: string | null
          last_name: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio?: string | null
          province?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          full_name?: string
          id?: string
          intermediary?: string | null
          last_name?: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio?: string | null
          province?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fundraising_report_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          fund_type: string | null
          id: string
          message: string | null
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          fund_type?: string | null
          id?: string
          message?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          fund_type?: string | null
          id?: string
          message?: string | null
          role?: string | null
          status?: string
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
      gp_call_requests: {
        Row: {
          created_at: string
          email: string
          firm: string
          fund_in_market: string | null
          id: string
          message: string | null
          name: string
          preferred_timezone: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          firm: string
          fund_in_market?: string | null
          id?: string
          message?: string | null
          name: string
          preferred_timezone?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          firm?: string
          fund_in_market?: string | null
          id?: string
          message?: string | null
          name?: string
          preferred_timezone?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gp_registrations: {
        Row: {
          aum_bracket: string
          created_at: string
          firm_name: string
          firm_website: string | null
          first_name: string
          id: string
          last_name: string
          main_fund_in_market: string | null
          primary_strategy: string[]
          role: string
          updated_at: string
          user_id: string | null
          welcome_email_sent: boolean
          work_email: string
        }
        Insert: {
          aum_bracket: string
          created_at?: string
          firm_name: string
          firm_website?: string | null
          first_name: string
          id?: string
          last_name: string
          main_fund_in_market?: string | null
          primary_strategy: string[]
          role: string
          updated_at?: string
          user_id?: string | null
          welcome_email_sent?: boolean
          work_email: string
        }
        Update: {
          aum_bracket?: string
          created_at?: string
          firm_name?: string
          firm_website?: string | null
          first_name?: string
          id?: string
          last_name?: string
          main_fund_in_market?: string | null
          primary_strategy?: string[]
          role?: string
          updated_at?: string
          user_id?: string | null
          welcome_email_sent?: boolean
          work_email?: string
        }
        Relationships: []
      }
      gu_portfolio_access: {
        Row: {
          access_granted_at: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          access_granted_at?: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          access_granted_at?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      lp_registrations: {
        Row: {
          areas_of_interest: string[] | null
          created_at: string
          email: string
          full_name: string
          id: string
          investor_type: string | null
          jurisdiction: string | null
          message: string | null
          organization: string
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          areas_of_interest?: string[] | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          investor_type?: string | null
          jurisdiction?: string | null
          message?: string | null
          organization: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          areas_of_interest?: string[] | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          investor_type?: string | null
          jurisdiction?: string | null
          message?: string | null
          organization?: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mazal_innovation_access: {
        Row: {
          access_granted_at: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          access_granted_at?: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          access_granted_at?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      mazal_investor_brief_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          organization: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          organization?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          organization?: string | null
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

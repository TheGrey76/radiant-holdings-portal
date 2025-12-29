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
      abc_authorized_users: {
        Row: {
          created_at: string
          email: string
          granted_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          granted_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          granted_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      abc_company_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      abc_console_access: {
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
      abc_email_campaign_history: {
        Row: {
          campaign_name: string
          content: string
          created_at: string
          failed_sends: number
          filter_category: string | null
          filter_status: string | null
          id: string
          recipient_count: number
          recipients: Json | null
          sent_at: string
          sent_by: string
          subject: string
          successful_sends: number
        }
        Insert: {
          campaign_name: string
          content: string
          created_at?: string
          failed_sends?: number
          filter_category?: string | null
          filter_status?: string | null
          id?: string
          recipient_count?: number
          recipients?: Json | null
          sent_at?: string
          sent_by: string
          subject: string
          successful_sends?: number
        }
        Update: {
          campaign_name?: string
          content?: string
          created_at?: string
          failed_sends?: number
          filter_category?: string | null
          filter_status?: string | null
          id?: string
          recipient_count?: number
          recipients?: Json | null
          sent_at?: string
          sent_by?: string
          subject?: string
          successful_sends?: number
        }
        Relationships: []
      }
      abc_email_opens: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          ip_address: string | null
          opened_at: string
          recipient_email: string
          recipient_name: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          opened_at?: string
          recipient_email: string
          recipient_name?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          opened_at?: string
          recipient_email?: string
          recipient_name?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abc_email_opens_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "abc_email_campaign_history"
            referencedColumns: ["id"]
          },
        ]
      }
      abc_email_responses: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          investor_email: string
          investor_id: string | null
          investor_name: string | null
          notes: string | null
          response_date: string
          response_type: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          investor_email: string
          investor_id?: string | null
          investor_name?: string | null
          notes?: string | null
          response_date?: string
          response_type?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          investor_email?: string
          investor_id?: string | null
          investor_name?: string | null
          notes?: string | null
          response_date?: string
          response_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "abc_email_responses_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "abc_email_campaign_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abc_email_responses_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "abc_investors"
            referencedColumns: ["id"]
          },
        ]
      }
      abc_email_templates: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      abc_investor_commitments: {
        Row: {
          amount: number
          commitment_date: string
          commitment_type: string
          created_at: string
          created_by: string
          currency: string
          expected_closing_date: string | null
          id: string
          investor_id: string | null
          investor_name: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          commitment_date?: string
          commitment_type?: string
          created_at?: string
          created_by: string
          currency?: string
          expected_closing_date?: string | null
          id?: string
          investor_id?: string | null
          investor_name: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          commitment_date?: string
          commitment_type?: string
          created_at?: string
          created_by?: string
          currency?: string
          expected_closing_date?: string | null
          id?: string
          investor_id?: string | null
          investor_name?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "abc_investor_commitments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "abc_investors"
            referencedColumns: ["id"]
          },
        ]
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
          email_opens_count: number | null
          email_responses_count: number | null
          engagement_score: number | null
          expected_close: string | null
          fonte: string | null
          id: string
          last_contact_date: string | null
          linkedin: string | null
          meetings_count: number | null
          next_follow_up_date: string | null
          nome: string
          notes_count: number | null
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
          email_opens_count?: number | null
          email_responses_count?: number | null
          engagement_score?: number | null
          expected_close?: string | null
          fonte?: string | null
          id?: string
          last_contact_date?: string | null
          linkedin?: string | null
          meetings_count?: number | null
          next_follow_up_date?: string | null
          nome: string
          notes_count?: number | null
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
          email_opens_count?: number | null
          email_responses_count?: number | null
          engagement_score?: number | null
          expected_close?: string | null
          fonte?: string | null
          id?: string
          last_contact_date?: string | null
          linkedin?: string | null
          meetings_count?: number | null
          next_follow_up_date?: string | null
          nome?: string
          notes_count?: number | null
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
      abc_notifications: {
        Row: {
          created_at: string
          from_user: string
          id: string
          investor_name: string
          is_read: boolean
          message: string
          note_id: string | null
          user_email: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          investor_name: string
          is_read?: boolean
          message: string
          note_id?: string | null
          user_email: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          investor_name?: string
          is_read?: boolean
          message?: string
          note_id?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "abc_notifications_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "abc_investor_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      aggregated_news: {
        Row: {
          category: string
          external_id: string | null
          fetched_at: string
          id: string
          image_url: string | null
          is_curated: boolean
          is_processed: boolean
          original_content: string | null
          original_url: string
          published_at: string | null
          relevance_score: number | null
          source_id: string | null
          source_name: string
          title: string
        }
        Insert: {
          category?: string
          external_id?: string | null
          fetched_at?: string
          id?: string
          image_url?: string | null
          is_curated?: boolean
          is_processed?: boolean
          original_content?: string | null
          original_url: string
          published_at?: string | null
          relevance_score?: number | null
          source_id?: string | null
          source_name: string
          title: string
        }
        Update: {
          category?: string
          external_id?: string | null
          fetched_at?: string
          id?: string
          image_url?: string | null
          is_curated?: boolean
          is_processed?: boolean
          original_content?: string | null
          original_url?: string
          published_at?: string | null
          relevance_score?: number | null
          source_id?: string | null
          source_name?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "aggregated_news_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
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
      asset_gu_access: {
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
      bitcoin_regime_history: {
        Row: {
          bitcoin_price_at_time: number | null
          confidence: number | null
          created_at: string | null
          id: number
          price_target_high: number | null
          price_target_low: number | null
          probability: number | null
          regime: string
          timestamp: string
        }
        Insert: {
          bitcoin_price_at_time?: number | null
          confidence?: number | null
          created_at?: string | null
          id?: number
          price_target_high?: number | null
          price_target_low?: number | null
          probability?: number | null
          regime: string
          timestamp: string
        }
        Update: {
          bitcoin_price_at_time?: number | null
          confidence?: number | null
          created_at?: string | null
          id?: number
          price_target_high?: number | null
          price_target_low?: number | null
          probability?: number | null
          regime?: string
          timestamp?: string
        }
        Relationships: []
      }
      bitcoin_report_data: {
        Row: {
          bitcoin_change_24h: number | null
          bitcoin_market_cap: number | null
          bitcoin_price_eur: number | null
          bitcoin_price_usd: number | null
          bitcoin_volume_24h: number | null
          created_at: string | null
          current_regime: string | null
          id: number
          inflation_rate: number | null
          institutional_target: number | null
          m2_value: number | null
          price_target_high: number | null
          price_target_low: number | null
          probability: number | null
          raw_data: Json | null
          real_rate: number | null
          regime_confidence: number | null
          timestamp: string
          unemployment_rate: number | null
          updated_at: string | null
        }
        Insert: {
          bitcoin_change_24h?: number | null
          bitcoin_market_cap?: number | null
          bitcoin_price_eur?: number | null
          bitcoin_price_usd?: number | null
          bitcoin_volume_24h?: number | null
          created_at?: string | null
          current_regime?: string | null
          id?: number
          inflation_rate?: number | null
          institutional_target?: number | null
          m2_value?: number | null
          price_target_high?: number | null
          price_target_low?: number | null
          probability?: number | null
          raw_data?: Json | null
          real_rate?: number | null
          regime_confidence?: number | null
          timestamp?: string
          unemployment_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          bitcoin_change_24h?: number | null
          bitcoin_market_cap?: number | null
          bitcoin_price_eur?: number | null
          bitcoin_price_usd?: number | null
          bitcoin_volume_24h?: number | null
          created_at?: string | null
          current_regime?: string | null
          id?: number
          inflation_rate?: number | null
          institutional_target?: number | null
          m2_value?: number | null
          price_target_high?: number | null
          price_target_low?: number | null
          probability?: number | null
          raw_data?: Json | null
          real_rate?: number | null
          regime_confidence?: number | null
          timestamp?: string
          unemployment_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bitcoin_report_latest: {
        Row: {
          bitcoin_price_eur: number | null
          bitcoin_price_usd: number | null
          current_regime: string | null
          id: number
          institutional_target: number | null
          m2_value: number | null
          price_target_high: number | null
          price_target_low: number | null
          probability: number | null
          raw_data: Json | null
          real_rate: number | null
          regime_confidence: number | null
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          bitcoin_price_eur?: number | null
          bitcoin_price_usd?: number | null
          current_regime?: string | null
          id?: number
          institutional_target?: number | null
          m2_value?: number | null
          price_target_high?: number | null
          price_target_low?: number | null
          probability?: number | null
          raw_data?: Json | null
          real_rate?: number | null
          regime_confidence?: number | null
          timestamp: string
          updated_at?: string | null
        }
        Update: {
          bitcoin_price_eur?: number | null
          bitcoin_price_usd?: number | null
          current_regime?: string | null
          id?: number
          institutional_target?: number | null
          m2_value?: number | null
          price_target_high?: number | null
          price_target_low?: number | null
          probability?: number | null
          raw_data?: Json | null
          real_rate?: number | null
          regime_confidence?: number | null
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bitcoin_report_updates_log: {
        Row: {
          bitcoin_data_updated: boolean | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: number
          macro_data_updated: boolean | null
          model_updated: boolean | null
          status: string | null
          update_timestamp: string
        }
        Insert: {
          bitcoin_data_updated?: boolean | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: number
          macro_data_updated?: boolean | null
          model_updated?: boolean | null
          status?: string | null
          update_timestamp: string
        }
        Update: {
          bitcoin_data_updated?: boolean | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: number
          macro_data_updated?: boolean | null
          model_updated?: boolean | null
          status?: string | null
          update_timestamp?: string
        }
        Relationships: []
      }
      bitcoin_treasuries: {
        Row: {
          bitcoin_holdings: number
          btc_price_usd: number | null
          company_name: string
          country: string | null
          created_at: string
          id: string
          rank: number
          ticker: string | null
          updated_at: string
          value_usd: number | null
        }
        Insert: {
          bitcoin_holdings: number
          btc_price_usd?: number | null
          company_name: string
          country?: string | null
          created_at?: string
          id?: string
          rank: number
          ticker?: string | null
          updated_at?: string
          value_usd?: number | null
        }
        Update: {
          bitcoin_holdings?: number
          btc_price_usd?: number | null
          company_name?: string
          country?: string | null
          created_at?: string
          id?: string
          rank?: number
          ticker?: string | null
          updated_at?: string
          value_usd?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          read_time: number | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
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
      curated_content: {
        Row: {
          ai_commentary: string | null
          ai_summary: string
          ai_tags: string[] | null
          created_at: string
          id: string
          news_id: string | null
          published_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ai_commentary?: string | null
          ai_summary: string
          ai_tags?: string[] | null
          created_at?: string
          id?: string
          news_id?: string | null
          published_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ai_commentary?: string | null
          ai_summary?: string
          ai_tags?: string[] | null
          created_at?: string
          id?: string
          news_id?: string | null
          published_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curated_content_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "aggregated_news"
            referencedColumns: ["id"]
          },
        ]
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
      monitoring_access: {
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
      news_sources: {
        Row: {
          category: string
          config: Json | null
          created_at: string
          fetch_interval_minutes: number | null
          id: string
          is_active: boolean
          last_fetched_at: string | null
          name: string
          source_type: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          config?: Json | null
          created_at?: string
          fetch_interval_minutes?: number | null
          id?: string
          is_active?: boolean
          last_fetched_at?: string | null
          name: string
          source_type: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          config?: Json | null
          created_at?: string
          fetch_interval_minutes?: number | null
          id?: string
          is_active?: boolean
          last_fetched_at?: string | null
          name?: string
          source_type?: string
          updated_at?: string
          url?: string
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
      search_index: {
        Row: {
          content: string | null
          content_type: string
          created_at: string
          description: string | null
          id: string
          search_vector: unknown
          tags: string[] | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          content?: string | null
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          search_vector?: unknown
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          content?: string | null
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          search_vector?: unknown
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
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
      calculate_investor_engagement_score: {
        Args: { investor_id_param: string }
        Returns: number
      }
      check_abc_console_access: {
        Args: { check_email: string }
        Returns: boolean
      }
      check_mazal_innovation_access: {
        Args: { check_email: string }
        Returns: boolean
      }
      get_current_user_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_abc_authorized: { Args: { _user_id: string }; Returns: boolean }
      search_content: {
        Args: { content_type_filter?: string; search_query: string }
        Returns: {
          content_type: string
          description: string
          id: string
          rank: number
          tags: string[]
          title: string
          url: string
        }[]
      }
      update_all_engagement_scores: { Args: never; Returns: undefined }
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

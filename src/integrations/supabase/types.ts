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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          completion_approved: boolean
          created_at: string
          end_date: string | null
          id: string
          posting_id: string
          stage: number
          start_date: string | null
          student_id: string
        }
        Insert: {
          completion_approved?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          posting_id: string
          stage?: number
          start_date?: string | null
          student_id: string
        }
        Update: {
          completion_approved?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          posting_id?: string
          stage?: number
          start_date?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          application_id: string
          code: string
          id: string
          issued_at: string
          revoked: boolean
          signatory_name: string
          signatory_title: string
          student_id: string
        }
        Insert: {
          application_id: string
          code: string
          id?: string
          issued_at?: string
          revoked?: boolean
          signatory_name: string
          signatory_title: string
          student_id: string
        }
        Update: {
          application_id?: string
          code?: string
          id?: string
          issued_at?: string
          revoked?: boolean
          signatory_name?: string
          signatory_title?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_admins: {
        Row: {
          institution_id: string
          user_id: string
        }
        Insert: {
          institution_id: string
          user_id: string
        }
        Update: {
          institution_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_admins_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          region: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          region?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          approved: boolean
          contact: string
          created_at: string
          description: string
          id: string
          industry: string
          logo_url: string | null
          name: string
          owner_id: string
          region: string
          website: string
        }
        Insert: {
          approved?: boolean
          contact: string
          created_at?: string
          description?: string
          id?: string
          industry?: string
          logo_url?: string | null
          name: string
          owner_id: string
          region: string
          website?: string
        }
        Update: {
          approved?: boolean
          contact?: string
          created_at?: string
          description?: string
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          region?: string
          website?: string
        }
        Relationships: []
      }
      postings: {
        Row: {
          created_at: string
          deadline: string
          description: string
          duration: string
          field: string
          id: string
          organization_id: string
          region: string
          slots: number
          title: string
        }
        Insert: {
          created_at?: string
          deadline: string
          description?: string
          duration: string
          field: string
          id?: string
          organization_id: string
          region: string
          slots?: number
          title: string
        }
        Update: {
          created_at?: string
          deadline?: string
          description?: string
          duration?: string
          field?: string
          id?: string
          organization_id?: string
          region?: string
          slots?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "postings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          bio: string
          course: string
          created_at: string
          department: string
          field: string
          full_name: string
          id: string
          id_photo_path: string | null
          institution_id: string | null
          linkedin_url: string
          phone: string
          placement_status: string
          region: string
          skills: string[]
          user_id: string
          verified: boolean
          visible_to_other_institutions: boolean
          year: string
        }
        Insert: {
          bio?: string
          course?: string
          created_at?: string
          department?: string
          field: string
          full_name: string
          id?: string
          id_photo_path?: string | null
          institution_id?: string | null
          linkedin_url?: string
          phone: string
          placement_status?: string
          region: string
          skills?: string[]
          user_id: string
          verified?: boolean
          visible_to_other_institutions?: boolean
          year: string
        }
        Update: {
          bio?: string
          course?: string
          created_at?: string
          department?: string
          field?: string
          full_name?: string
          id?: string
          id_photo_path?: string | null
          institution_id?: string | null
          linkedin_url?: string
          phone?: string
          placement_status?: string
          region?: string
          skills?: string[]
          user_id?: string
          verified?: boolean
          visible_to_other_institutions?: boolean
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      can_see_application: {
        Args: { _posting_id: string; _student_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_institution_admin: {
        Args: { _institution_id: string; _user_id: string }
        Returns: boolean
      }
      is_own_student: {
        Args: { _student_id: string; _user_id: string }
        Returns: boolean
      }
      owns_organization: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "institution_admin" | "organization" | "super_admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["student", "institution_admin", "organization", "super_admin"],
    },
  },
} as const

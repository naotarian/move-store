export interface Estimate {
  id: string;
  customer_name: string;
  customer_furigana: string;
  customer_phone: string;
  moving_to: {
    prefecture: string;
    city: string;
    street_address: string;
    building_name?: string;
  };
  moving_from: {
    prefecture: string;
    city: string;
    street_address: string;
    building_name?: string;
  };
  moving_date_type: string;
  moving_date?: string;
  moving_year_month?: string;
  moving_period?: string;
  people_count: number;
  work_start_time_type: string;
  work_start_time?: string;
  status: string;
  created_at: string;
}

export interface EstimatesResponse {
  success: boolean;
  data: Estimate[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface StatusInfo {
  label: string;
  color: string;
}

// ステータス定数（バックエンドのEstimateモデルと一致）
export const ESTIMATE_STATUS = {
  DRAFT: "draft", // 公開前
  PUBLISHED: "published", // 公開中
  CLOSED: "closed", // 公開終了
} as const;

export type EstimateStatus =
  (typeof ESTIMATE_STATUS)[keyof typeof ESTIMATE_STATUS];

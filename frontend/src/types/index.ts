export interface WasteItem {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  disposal_instructions: string;
  recycling_information: string;
  preparation_instructions: string;
  safety_warning?: string | null;
  recyclable: boolean;
  compostable: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WasteItemCreate {
  name: string;
  category: string;
  description: string;
  disposal_instructions: string;
  recycling_information: string;
  preparation_instructions: string;
  safety_warning?: string | null;
  recyclable: boolean;
  compostable: boolean;
}

export interface CollectionRequestCreate {
  requester_name: string;
  contact_email?: string;
  contact_phone?: string;
  waste_category: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  pickup_area: string;
  preferred_pickup_date: string;
  additional_notes?: string;
}

export interface CollectionRequest {
  id?: number;
  request_code: string;
  requester_name?: string;
  contact_email?: string;
  contact_phone?: string;
  waste_category: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  pickup_area: string;
  preferred_pickup_date: string;
  status: 'Pending' | 'Accepted' | 'Scheduled' | 'Collected' | 'Cancelled';
  partner_note?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface WasteIdentifyResponse {
  item_name: string;
  category: string;
  disposal_instructions: string;
  recycling_information: string;
  preparation_instructions: string;
  safety_warning?: string | null;
  recyclable: boolean;
  compostable: boolean;
  identification_mode: string;
  confidence_score?: number | null;
  notice: string;
}

export interface DashboardStats {
  total_requests: number;
  completed_requests: number;
  pending_requests: number;
  scheduled_requests: number;
  accepted_requests: number;
  completion_rate_percent: number;
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
  percentage: number;
}

export interface DailyTip {
  id: string;
  category: string;
  title: string;
  text: string;
}

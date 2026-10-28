import {
  WasteItem,
  WasteItemCreate,
  CollectionRequest,
  CollectionRequestCreate,
  WasteIdentifyResponse,
  DashboardStats,
  CategoryDistributionItem,
  DailyTip,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : '').replace(/\/$/, '');

async function fetchJSON<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `Server error (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.detail) {
          if (Array.isArray(errJson.detail)) {
            errorMsg = errJson.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
          } else {
            errorMsg = errJson.detail;
          }
        }
      } catch {
        // use default errorMsg
      }
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to reach EcoSort backend at ${API_BASE}. Please verify that the backend is running and CORS is configured.`
      );
    }
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => fetchJSON<{ status: string; service: string; environment: string; database: string }>('/api/health'),

  // Waste Items
  getWasteItems: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return fetchJSON<WasteItem[]>(`/api/waste-items${query}`);
  },
  searchWasteItems: (q: string) => fetchJSON<WasteItem[]>(`/api/waste-items/search?q=${encodeURIComponent(q)}`),
  getCategories: () => fetchJSON<string[]>('/api/waste-items/categories'),
  getWasteItem: (id: number) => fetchJSON<WasteItem>(`/api/waste-items/${id}`),
  createWasteItem: (item: WasteItemCreate, adminKey?: string) => {
    const headers: Record<string, string> = {};
    if (adminKey) headers['X-Admin-Key'] = adminKey;
    return fetchJSON<WasteItem>('/api/waste-items', {
      method: 'POST',
      body: JSON.stringify(item),
      headers,
    });
  },
  updateWasteItem: (id: number, item: Partial<WasteItem>, adminKey?: string) => {
    const headers: Record<string, string> = {};
    if (adminKey) headers['X-Admin-Key'] = adminKey;
    return fetchJSON<WasteItem>(`/api/waste-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
      headers,
    });
  },
  deleteWasteItem: (id: number, adminKey?: string) => {
    const headers: Record<string, string> = {};
    if (adminKey) headers['X-Admin-Key'] = adminKey;
    return fetchJSON<void>(`/api/waste-items/${id}`, {
      method: 'DELETE',
      headers,
    });
  },

  // Identification
  identifyWaste: async (image?: File | null, manualItem?: string) => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    if (manualItem) {
      formData.append('manual_item', manualItem);
    }
    return fetchJSON<WasteIdentifyResponse>('/api/identify', {
      method: 'POST',
      body: formData,
    });
  },

  // Collection Requests
  createCollectionRequest: (payload: CollectionRequestCreate) =>
    fetchJSON<CollectionRequest>('/api/collection-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCollectionRequest: (requestCode: string) =>
    fetchJSON<CollectionRequest>(`/api/collection-requests/${encodeURIComponent(requestCode)}`),
  listCollectionRequests: (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return fetchJSON<CollectionRequest[]>(`/api/collection-requests${query}`);
  },
  updateRequestStatus: (id: number, status: string, note?: string, adminKey?: string) => {
    const headers: Record<string, string> = {};
    if (adminKey) headers['X-Admin-Key'] = adminKey;
    return fetchJSON<CollectionRequest>(`/api/collection-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, partner_note: note }),
      headers,
    });
  },
  cancelCollectionRequest: (requestCode: string, reason?: string) =>
    fetchJSON<CollectionRequest>(`/api/collection-requests/${encodeURIComponent(requestCode)}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancellation_reason: reason }),
    }),

  // Dashboard & Analytics
  getDashboardStats: () => fetchJSON<DashboardStats>('/api/dashboard/stats'),
  getCategoryDistribution: () => fetchJSON<CategoryDistributionItem[]>('/api/dashboard/category-distribution'),
  getDailyTips: () => fetchJSON<DailyTip[]>('/api/dashboard/daily-tips'),

  // Admin & Partner APIs
  getAdminRequests: (status?: string, adminKey?: string) => {
    const headers: Record<string, string> = {};
    if (adminKey) headers['X-Admin-Key'] = adminKey;
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return fetchJSON<CollectionRequest[]>(`/api/admin/requests${query}`, { headers });
  },
  getAdminOverview: (adminKey?: string) => {
    const headers: Record<string, string> = {};
    if (adminKey) headers['X-Admin-Key'] = adminKey;
    return fetchJSON<any>('/api/admin/overview', { headers });
  },
  getPartnerRequests: (partnerKey?: string) => {
    const headers: Record<string, string> = {};
    if (partnerKey) headers['X-Partner-Key'] = partnerKey;
    return fetchJSON<CollectionRequest[]>('/api/partners/requests', { headers });
  },
  acceptPartnerRequest: (id: number, note?: string, partnerKey?: string) => {
    const headers: Record<string, string> = {};
    if (partnerKey) headers['X-Partner-Key'] = partnerKey;
    return fetchJSON<CollectionRequest>(`/api/partners/requests/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify({ note }),
      headers,
    });
  },
  schedulePartnerRequest: (id: number, note?: string, partnerKey?: string) => {
    const headers: Record<string, string> = {};
    if (partnerKey) headers['X-Partner-Key'] = partnerKey;
    return fetchJSON<CollectionRequest>(`/api/partners/requests/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ note }),
      headers,
    });
  },
  completePartnerRequest: (id: number, note?: string, partnerKey?: string) => {
    const headers: Record<string, string> = {};
    if (partnerKey) headers['X-Partner-Key'] = partnerKey;
    return fetchJSON<CollectionRequest>(`/api/partners/requests/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ note }),
      headers,
    });
  },
};

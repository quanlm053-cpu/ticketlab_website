const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const apiCall = async (
  endpoint: string,
  options: ApiOptions = {}
) => {
  const { method = "GET", body, headers = {} } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// Events API
export const eventsApi = {
  getAll: (category?: string) => 
    apiCall(`/events${category ? `?category=${category}` : ""}`),
  
  getById: (id: number) => apiCall(`/events/${id}`),
  
  create: (data: any) =>
    apiCall("/events", { method: "POST", body: data }),
  
  update: (id: number, data: any) =>
    apiCall(`/events/${id}`, { method: "PUT", body: data }),
  
  delete: (id: number) =>
    apiCall(`/events/${id}`, { method: "DELETE" }),
};

// Orders API
export const ordersApi = {
  create: (data: any) =>
    apiCall("/orders", { method: "POST", body: data }),
  
  getMyOrders: () => apiCall("/orders/user/my-orders"),
  
  complete: (orderId: number) =>
    apiCall(`/orders/${orderId}/complete`, { method: "POST" }),
  
  getAll: () => apiCall("/orders"),
};

// Tickets API
export const ticketsApi = {
  getMyTickets: () => apiCall("/tickets"),
  
  getById: (id: number) => apiCall(`/tickets/${id}`),
  
  getAll: () => apiCall("/tickets/admin/all"),
};

// Upload API (uses FormData, not JSON)
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const token = getToken();
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  return data.imagePath;
};

// Admin API
export const adminApi = {
  getStats: () => apiCall("/admin/stats"),
};

// Auth API
export const authApi = {
  register: (data: any) =>
    apiCall("/auth/register", { method: "POST", body: data }),
  
  login: (data: any) =>
    apiCall("/auth/login", { method: "POST", body: data }),
  
  getMe: () => apiCall("/auth/me"),
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL.replace("/api", "")}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};

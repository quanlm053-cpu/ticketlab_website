import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface User {
  user_id?: string | number;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventImage: string;
  ticketType: string;
  price: number;
  date: string;
  location: string;
  purchaseDate: string;
}

export interface Booking {
  eventId: number;
  eventName: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
}

export interface CompletedOrder {
  orderId: string;
  eventId: string;
  eventName: string;
  eventImage: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  date: string;
  location: string;
  venue: string;
  address: string;
  startTime: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  bookingCart: Booking | null;
  lastCompletedOrder: CompletedOrder | null;
  userTickets: Ticket[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setBookingCart: (booking: Booking) => void;
  clearBookingCart: () => void;
  addTicket: (ticket: Ticket) => void;
  completeOrder: (order: CompletedOrder) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  bookingCart: null,
  lastCompletedOrder: null,
  userTickets: [],
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      const user: User = {
        id: data.user.user_id,
        user_id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: "/images/avatar-default.jpg",
      };

      localStorage.setItem("token", data.token);
      set({
        user,
        isAuthenticated: true,
        token: data.token,
      });
    } catch (error) {
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const data = await response.json();
      const user: User = {
        id: data.user.user_id,
        user_id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: "/images/avatar-default.jpg",
      };

      localStorage.setItem("token", data.token);
      set({
        user,
        isAuthenticated: true,
        token: data.token,
      });
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isAuthenticated: false,
      token: null,
      bookingCart: null,
    });
  },
  setBookingCart: (booking: Booking) => {
    set({ bookingCart: booking });
  },
  clearBookingCart: () => {
    set({ bookingCart: null });
  },
  addTicket: (ticket: Ticket) => {
    set((state) => ({
      userTickets: [...state.userTickets, ticket],
    }));
  },
  completeOrder: (order: CompletedOrder) => {
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      eventId: order.eventId,
      eventName: order.eventName,
      eventImage: order.eventImage,
      ticketType: `${order.ticketType} (x${order.quantity})`,
      price: order.totalPrice,
      date: order.date,
      location: order.location,
      purchaseDate: new Date().toLocaleDateString("vi-VN"),
    };
    set((state) => ({
      lastCompletedOrder: order,
      bookingCart: null,
      userTickets: [...state.userTickets, ticket],
    }));
  },
}));

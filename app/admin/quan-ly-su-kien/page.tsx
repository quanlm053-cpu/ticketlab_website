"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { eventsApi, uploadImage } from "@/lib/api";
import { LogOut, ArrowLeft, Eye, Edit, Trash2, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ApiEvent {
  event_id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  event_date: string;
  price: number;
  image: string;
  ticketTypes?: string | Array<{ name: string; price: number; quantity: number }>;
}

const defaultForm = {
  name: "",
  description: "",
  location: "",
  category: "music",
  date: "",
  price: 0,
  image: "",
};

export default function AdminEventManagement() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [eventsList, setEventsList] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [addForm, setAddForm] = useState(defaultForm);
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string>("");
  const [editImagePreview, setEditImagePreview] = useState<string>("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getAll();
      setEventsList(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchEvents();
    }
  }, [isAuthenticated, user, fetchEvents]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/dang-nhap");
  };

  const parseTicketTypes = (event: ApiEvent) => {
    if (!event.ticketTypes) return [];
    if (typeof event.ticketTypes === "string") {
      try { return JSON.parse(event.ticketTypes); } catch { return []; }
    }
    return event.ticketTypes;
  };

  const handleViewEvent = (event: ApiEvent) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event: ApiEvent) => {
    setSelectedEvent(event);
    setEditForm({
      name: event.name || "",
      description: event.description || "",
      location: event.location || "",
      category: event.category || "music",
      date: event.event_date || "",
      price: event.price || 0,
      image: event.image || "",
    });
    setEditImageFile(null);
    setEditImagePreview(event.image || "");
    setShowEditModal(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEventToDelete(eventId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        setSaving(true);
        await eventsApi.delete(eventToDelete);
        setShowDeleteConfirm(false);
        setEventToDelete(null);
        await fetchEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Xóa sự kiện thất bại!");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent) return;
    try {
      setSaving(true);
      let imagePath = editForm.image;
      if (editImageFile) {
        imagePath = await uploadImage(editImageFile);
      }
      await eventsApi.update(selectedEvent.event_id, { ...editForm, image: imagePath });
      setShowEditModal(false);
      setSelectedEvent(null);
      setEditImageFile(null);
      setEditImagePreview("");
      await fetchEvents();
    } catch (error) {
      console.error("Failed to update event:", error);
      alert("Cập nhật sự kiện thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      setSaving(true);
      let imagePath = addForm.image;
      if (addImageFile) {
        imagePath = await uploadImage(addImageFile);
      }
      await eventsApi.create({ ...addForm, image: imagePath });
      setShowAddModal(false);
      setAddForm(defaultForm);
      setAddImageFile(null);
      setAddImagePreview("");
      await fetchEvents();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Thêm sự kiện thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-[#2d5f5d]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#c8a96e] text-sm font-bold text-[#1a1a1a]">
              TL
            </div>
            <h1 className="text-xl font-bold text-[#ffffff]">TicketLab Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#ffffff]/80">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Back button */}
        <Link
          href="/admin/dashboard"
          className="mb-6 flex items-center gap-2 text-[#2d5f5d] transition-colors hover:text-[#245250]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Dashboard
        </Link>

        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1a1a1a]">
              Quản lý sự kiện
            </h2>
            <p className="mt-2 text-[#666666]">
              Danh sách tất cả các sự kiện
            </p>
          </div>
          <button
            onClick={() => { setAddForm(defaultForm); setShowAddModal(true); }}
            className="flex items-center gap-2 rounded-lg bg-[#2d5f5d] px-6 py-3 font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]"
          >
            <Plus className="h-4 w-4" />
            Thêm sự kiện
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#2d5f5d]" />
            <span className="ml-3 text-[#666666]">Đang tải...</span>
          </div>
        ) : eventsList.length === 0 ? (
          <div className="rounded-lg bg-[#ffffff] p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#666666]">Chưa có sự kiện nào</p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventsList.map((event) => (
              <div
                key={event.event_id}
                className="overflow-hidden rounded-lg bg-[#ffffff] shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden bg-[#f5f5f5]">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#999]">Không có ảnh</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-bold text-[#1a1a1a]">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-xs text-[#666666]">
                    {event.event_date} {"\u2022"} {event.location}
                  </p>
                  <p className="mt-2 font-semibold text-[#2d5f5d]">
                    {(event.price || 0).toLocaleString("vi-VN")} đ
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewEvent(event)}
                      className="flex-1 rounded bg-[#2d5f5d] py-2 text-xs font-semibold text-[#ffffff] transition-colors hover:bg-[#245250] flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Xem
                    </button>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex-1 rounded border border-[#2d5f5d] py-2 text-xs font-semibold text-[#2d5f5d] transition-colors hover:bg-[#f5f5f5] flex items-center justify-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.event_id)}
                      className="flex-1 rounded border border-red-600 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Event Modal */}
      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50 p-4">
          <div className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-[#ffffff]">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e0e0e0] bg-[#ffffff] p-6">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Chi tiết sự kiện</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-[#666666] hover:text-[#1a1a1a]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {selectedEvent.image && (
                <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold text-[#1a1a1a]">{selectedEvent.name}</h2>
              <p className="mt-2 text-[#666666]">{selectedEvent.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Ngày</p>
                  <p className="mt-1 font-semibold text-[#1a1a1a]">{selectedEvent.event_date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Địa điểm</p>
                  <p className="mt-1 font-semibold text-[#1a1a1a]">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Giá vé</p>
                  <p className="mt-1 font-semibold text-[#2d5f5d]">{(selectedEvent.price || 0).toLocaleString("vi-VN")} đ</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Danh mục</p>
                  <p className="mt-1 font-semibold text-[#1a1a1a]">{selectedEvent.category}</p>
                </div>
              </div>
              {/* Ticket Types */}
              {parseTicketTypes(selectedEvent).length > 0 && (
                <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                  <h3 className="font-bold text-[#1a1a1a]">Loại vé</h3>
                  <div className="mt-3 space-y-2">
                    {parseTicketTypes(selectedEvent).map((tt: any, i: number) => (
                      <div key={i} className="flex justify-between rounded border border-[#e0e0e0] px-4 py-2 text-sm">
                        <span>{tt.name}</span>
                        <span className="font-semibold">{(tt.price || 0).toLocaleString("vi-VN")} đ (SL: {tt.quantity})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="mt-6 w-full rounded-lg bg-[#2d5f5d] py-3 font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50 p-4">
          <div className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-[#ffffff] w-full">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e0e0e0] bg-[#ffffff] p-6">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Chỉnh sửa sự kiện</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#666666] hover:text-[#1a1a1a]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a]">Tên sự kiện</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a]">Mô tả</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Ngày</label>
                  <input
                    type="text"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Địa điểm</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Giá</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Danh mục</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  >
                    <option value="music">Nhạc sống</option>
                    <option value="festival">Lễ hội</option>
                    <option value="exhibition">Triển lãm</option>
                    <option value="sports">Thể thao</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a]">Hình ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, setEditImageFile, setEditImagePreview)}
                  className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] file:mr-3 file:rounded file:border-0 file:bg-[#2d5f5d] file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-[#245250]"
                />
                {editImagePreview && (
                  <div className="mt-2 relative h-32 w-48 overflow-hidden rounded border border-[#e0e0e0]">
                    <Image src={editImagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[#2d5f5d] py-3 font-semibold text-[#ffffff] transition-colors hover:bg-[#245250] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-lg border border-[#e0e0e0] py-3 font-semibold text-[#666666] transition-colors hover:bg-[#f5f5f5]"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50 p-4">
          <div className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-[#ffffff] w-full">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e0e0e0] bg-[#ffffff] p-6">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Thêm sự kiện mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#666666] hover:text-[#1a1a1a]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a]">Tên sự kiện</label>
                <input
                  type="text"
                  placeholder="Nhập tên sự kiện"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a]">Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả sự kiện"
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  rows={4}
                  className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Ngày</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={addForm.date}
                    onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Giá vé</label>
                  <input
                    type="number"
                    placeholder="Nhập giá vé"
                    value={addForm.price || ""}
                    onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a]">Địa điểm</label>
                <input
                  type="text"
                  placeholder="Nhập địa điểm"
                  value={addForm.location}
                  onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Danh mục</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] focus:border-[#2d5f5d] focus:outline-none"
                  >
                    <option value="music">Nhạc sống</option>
                    <option value="festival">Lễ hội</option>
                    <option value="exhibition">Triển lãm</option>
                    <option value="sports">Thể thao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Hình ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, setAddImageFile, setAddImagePreview)}
                    className="mt-2 w-full rounded border border-[#e0e0e0] px-3 py-2 text-[#1a1a1a] file:mr-3 file:rounded file:border-0 file:bg-[#2d5f5d] file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-[#245250]"
                  />
                  {addImagePreview && (
                    <div className="mt-2 relative h-32 w-48 overflow-hidden rounded border border-[#e0e0e0]">
                      <Image src={addImagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddEvent}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[#2d5f5d] py-3 font-semibold text-[#ffffff] transition-colors hover:bg-[#245250] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Thêm sự kiện
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-[#e0e0e0] py-3 font-semibold text-[#666666] transition-colors hover:bg-[#f5f5f5]"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-[#ffffff] p-6">
            <h3 className="text-xl font-bold text-[#1a1a1a]">Xóa sự kiện</h3>
            <p className="mt-3 text-[#666666]">Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể được hoàn tác.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-[#ffffff] transition-colors hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Xóa
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-[#e0e0e0] py-3 font-semibold text-[#666666] transition-colors hover:bg-[#f5f5f5]"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

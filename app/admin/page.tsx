"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  PawPrint, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCcw,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

type Appointment = {
  id: string;
  customer_name: string;
  phone: string;
  arrival_time: string;
  pet_type: string;
  service_type: string;
  note: string | null;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/appointments");
      if (!response.ok) throw new Error("獲取資料失敗");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError("無法載入預約資訊，請確認資料庫連線。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
        );
      }
    } catch (err) {
      alert("更新狀態失敗");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle size={14} className="mr-1" />;
      case "confirmed": return <CheckCircle size={14} className="mr-1" />;
      case "completed": return <CheckCircle size={14} className="mr-1" />;
      case "cancelled": return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Settings className="text-teal-600" />
                管理後台
              </h1>
            </div>
            <button 
              onClick={fetchAppointments}
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors text-sm font-medium"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              重新整理
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <XCircle />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">預約資訊</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">寵物與服務</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">到店時間</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">狀態</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">備註</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 h-20 bg-gray-50/50"></td>
                    </tr>
                  ))
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      目前沒有任何預約記錄
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            {apt.customer_name}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Phone size={14} className="text-gray-400" />
                            {apt.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium flex items-center gap-2 text-teal-700">
                            <PawPrint size={14} />
                            {apt.pet_type}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">{apt.service_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(apt.arrival_time).toLocaleDateString('zh-TW')}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Clock size={14} className="text-gray-400" />
                            {new Date(apt.arrival_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(apt.status)}`}>
                          {getStatusIcon(apt.status)}
                          {apt.status === "pending" ? "待處理" : 
                           apt.status === "confirmed" ? "已確認" : 
                           apt.status === "completed" ? "已完成" : "已取消"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 max-w-xs truncate" title={apt.note || ""}>
                          {apt.note || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {apt.status === "pending" && (
                            <button 
                              onClick={() => updateStatus(apt.id, "confirmed")}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="確認預約"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {apt.status !== "cancelled" && apt.status !== "completed" && (
                            <button 
                              onClick={() => updateStatus(apt.id, "cancelled")}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="取消預約"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          {apt.status === "confirmed" && (
                            <button 
                              onClick={() => updateStatus(apt.id, "completed")}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="完成預約"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Pagination } from './Pagination';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-700',
};

const AVATAR_GRADIENTS = [
  'from-green-500 to-emerald-600',
  'from-blue-500 to-cyan-600',
  'from-purple-500 to-fuchsia-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
];

const gradientFor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

export const AdminContactTab = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchSubmissions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/contact?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data.submissions);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchSubmissions(1);
  }, [fetchSubmissions]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        fetchSubmissions(pagination.page);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  return (
    <Card className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Contact Submissions</h2>
        <Badge variant="outline">{pagination.total} Messages</Badge>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
          No messages yet.
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {submissions.map((s) => (
              <div key={s._id} className="p-6 hover:bg-gray-50/80 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientFor(s.name || s.email)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {(s.name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-gray-800">{s.name}</h4>
                      <Badge className={STATUS_COLORS[s.status]}>{s.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{s.email} · {new Date(s.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-3">{s.message}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {s.status !== 'read' && (
                      <button onClick={() => updateStatus(s._id, 'read')} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        Mark Read
                      </button>
                    )}
                    {s.status !== 'replied' && (
                      <button onClick={() => updateStatus(s._id, 'replied')} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                        Mark Replied
                      </button>
                    )}
                    <button onClick={() => handleDelete(s._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center gap-1 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => fetchSubmissions(p)}
          />
        </>
      )}
    </Card>
  );
};

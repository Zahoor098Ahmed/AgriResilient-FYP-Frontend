import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Pagination } from './Pagination';
import { formatRelativeTime } from '../../lib/relativeTime';

const emptyForm = {
  titleEn: '', titleUr: '', titleSd: '',
  excerptEn: '', excerptUr: '', excerptSd: '',
  contentEn: '', contentUr: '', contentSd: '',
  author: '', image: '', published: true,
};

export const AdminBlogTab = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/blog?page=${page}&limit=10`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Forces "X minutes ago" labels to keep advancing even when the post
  // list itself hasn't changed and there's nothing new to fetch.
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (post) => {
    setForm({
      titleEn: post.title?.en || '', titleUr: post.title?.ur || '', titleSd: post.title?.sd || '',
      excerptEn: post.excerpt?.en || '', excerptUr: post.excerpt?.ur || '', excerptSd: post.excerpt?.sd || '',
      contentEn: post.content?.en || '', contentUr: post.content?.ur || '', contentSd: post.content?.sd || '',
      author: post.author || '', image: post.image || '', published: post.published,
    });
    setEditingId(post._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.titleEn || !form.excerptEn || !form.contentEn) {
      alert('English title, excerpt, and content are required.');
      return;
    }
    setSaving(true);
    const payload = {
      title: { en: form.titleEn, ur: form.titleUr, sd: form.titleSd },
      excerpt: { en: form.excerptEn, ur: form.excerptUr, sd: form.excerptSd },
      content: { en: form.contentEn, ur: form.contentUr, sd: form.contentSd },
      author: form.author,
      image: form.image,
      published: form.published,
    };

    try {
      const url = editingId ? `${API_URL}/api/admin/blog/${editingId}` : `${API_URL}/api/admin/blog`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        fetchPosts(editingId ? pagination.page : 1);
      } else {
        alert(data.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) fetchPosts(pagination.page);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (showForm) {
    return (
      <Card className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Author</Label>
            <Input className="mt-1" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input className="mt-1" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </div>

          {[
            { key: 'title', label: 'Title', type: 'input' },
            { key: 'excerpt', label: 'Excerpt', type: 'input' },
            { key: 'content', label: 'Content', type: 'textarea' },
          ].map(({ key, label, type }) => (
            <div key={key} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{label}</h4>
              {['En', 'Ur', 'Sd'].map((lang) => {
                const field = `${key}${lang}`;
                const Comp = type === 'textarea' ? Textarea : Input;
                return (
                  <div key={field}>
                    <Label className="text-xs text-gray-500">{lang === 'En' ? 'English (required)' : lang === 'Ur' ? 'Urdu (optional)' : 'Sindhi (optional)'}</Label>
                    <Comp
                      className="mt-1"
                      rows={type === 'textarea' ? 6 : undefined}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published (visible on the public site)
          </label>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-xl">
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Blog Posts</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{pagination.total} Posts</Badge>
          <Button onClick={openNewForm} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          No posts yet — the public Resources page is showing its built-in demo articles instead.
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <div key={post._id} className="p-6 flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 truncate">{post.title?.en}</h4>
                      <Badge className={post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {post.author} · {post.updatedAt && post.updatedAt !== post.createdAt ? 'Updated ' : ''}{formatRelativeTime(post.updatedAt || post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEditForm(post)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => fetchPosts(p)}
          />
        </>
      )}
    </Card>
  );
};

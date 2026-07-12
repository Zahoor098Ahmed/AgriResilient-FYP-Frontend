import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileText, Sparkles, Users, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { uploadImage } from '../../lib/uploadImage';

const emptyValue = { titleEn: '', titleUr: '', titleSd: '', descEn: '', descUr: '', descSd: '' };
const emptyMember = { name: '', roleEn: '', roleUr: '', roleSd: '', emoji: '👤', image: '' };

export const AdminAboutTab = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [introEn, setIntroEn] = useState('');
  const [introUr, setIntroUr] = useState('');
  const [introSd, setIntroSd] = useState('');
  const [values, setValues] = useState([]);
  const [team, setTeam] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleTeamPhotoUpload = async (i, file) => {
    if (!file) return;
    setUploadingIndex(i);
    try {
      const url = await uploadImage(file, token);
      setTeam((prev) => prev.map((x, idx) => (idx === i ? { ...x, image: url } : x)));
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/content/about`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.data?.content) {
        const c = data.data.content;
        setIntroEn(c.intro?.en || '');
        setIntroUr(c.intro?.ur || '');
        setIntroSd(c.intro?.sd || '');
        setValues((c.values || []).map((v) => ({
          titleEn: v.title?.en || '', titleUr: v.title?.ur || '', titleSd: v.title?.sd || '',
          descEn: v.desc?.en || '', descUr: v.desc?.ur || '', descSd: v.desc?.sd || '',
        })));
        setTeam((c.team || []).map((m) => ({
          name: m.name || '', roleEn: m.role?.en || '', roleUr: m.role?.ur || '', roleSd: m.role?.sd || '', emoji: m.emoji || '👤', image: m.image || '',
        })));
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      intro: { en: introEn, ur: introUr, sd: introSd },
      values: values.map((v) => ({
        title: { en: v.titleEn, ur: v.titleUr, sd: v.titleSd },
        desc: { en: v.descEn, ur: v.descUr, sd: v.descSd },
      })),
      team: team.map((m) => ({
        name: m.name,
        role: { en: m.roleEn, ur: m.roleUr, sd: m.roleSd },
        emoji: m.emoji,
        image: m.image,
      })),
    };
    try {
      const res = await fetch(`${API_URL}/api/admin/content/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) alert(data.message || 'Failed to save');
      else alert('About page content saved.');
    } catch (error) {
      console.error('Error saving about content:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-800">Intro Text</h2>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">English (required)</Label>
            <Textarea className="mt-1" rows={3} value={introEn} onChange={(e) => setIntroEn(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Urdu (optional)</Label>
            <Textarea className="mt-1" rows={3} value={introUr} onChange={(e) => setIntroUr(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Sindhi (optional)</Label>
            <Textarea className="mt-1" rows={3} value={introSd} onChange={(e) => setIntroSd(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Our Values</h2>
          </div>
          <Button size="sm" onClick={() => setValues([...values, { ...emptyValue }])} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" /> Add Value
          </Button>
        </div>
        <div className="space-y-4">
          {values.map((v, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-gray-50/50">
              <button
                onClick={() => setValues(values.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid md:grid-cols-3 gap-3">
                <Input placeholder="Title (English)" value={v.titleEn} onChange={(e) => setValues(values.map((x, idx) => idx === i ? { ...x, titleEn: e.target.value } : x))} />
                <Input placeholder="Title (Urdu)" value={v.titleUr} onChange={(e) => setValues(values.map((x, idx) => idx === i ? { ...x, titleUr: e.target.value } : x))} />
                <Input placeholder="Title (Sindhi)" value={v.titleSd} onChange={(e) => setValues(values.map((x, idx) => idx === i ? { ...x, titleSd: e.target.value } : x))} />
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <Input placeholder="Description (English)" value={v.descEn} onChange={(e) => setValues(values.map((x, idx) => idx === i ? { ...x, descEn: e.target.value } : x))} />
                <Input placeholder="Description (Urdu)" value={v.descUr} onChange={(e) => setValues(values.map((x, idx) => idx === i ? { ...x, descUr: e.target.value } : x))} />
                <Input placeholder="Description (Sindhi)" value={v.descSd} onChange={(e) => setValues(values.map((x, idx) => idx === i ? { ...x, descSd: e.target.value } : x))} />
              </div>
            </div>
          ))}
          {values.length === 0 && <p className="text-sm text-gray-400">No custom values yet — public page shows its built-in defaults.</p>}
        </div>
      </Card>

      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Team Members</h2>
          </div>
          <Button size="sm" onClick={() => setTeam([...team, { ...emptyMember }])} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>
        <div className="space-y-4">
          {team.map((m, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-gray-50/50">
              <button
                onClick={() => setTeam(team.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-2xl">
                  <span>{m.emoji || '👤'}</span>
                  {m.image && (
                    <img
                      src={m.image}
                      alt={m.name || 'Team member'}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
                <Input placeholder="Name" value={m.name} onChange={(e) => setTeam(team.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} className="flex-1" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <Input placeholder="Photo URL (optional — overrides emoji)" value={m.image} onChange={(e) => setTeam(team.map((x, idx) => idx === i ? { ...x, image: e.target.value } : x))} className="flex-1" />
                  <label className="flex-shrink-0 flex items-center gap-1.5 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                    {uploadingIndex === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploadingIndex === i}
                      onChange={(e) => handleTeamPhotoUpload(i, e.target.files?.[0])}
                    />
                  </label>
                </div>
                <Input placeholder="Emoji (used if no photo)" value={m.emoji} onChange={(e) => setTeam(team.map((x, idx) => idx === i ? { ...x, emoji: e.target.value } : x))} />
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <Input placeholder="Role (English)" value={m.roleEn} onChange={(e) => setTeam(team.map((x, idx) => idx === i ? { ...x, roleEn: e.target.value } : x))} />
                <Input placeholder="Role (Urdu)" value={m.roleUr} onChange={(e) => setTeam(team.map((x, idx) => idx === i ? { ...x, roleUr: e.target.value } : x))} />
                <Input placeholder="Role (Sindhi)" value={m.roleSd} onChange={(e) => setTeam(team.map((x, idx) => idx === i ? { ...x, roleSd: e.target.value } : x))} />
              </div>
            </div>
          ))}
          {team.length === 0 && <p className="text-sm text-gray-400">No custom team members yet — public page shows its built-in defaults.</p>}
        </div>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-xl gap-2">
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save About Page'}
      </Button>
    </div>
  );
};

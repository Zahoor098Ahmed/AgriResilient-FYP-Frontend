import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Quote, Star, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { uploadImage } from '../../lib/uploadImage';

const emptyTestimonial = {
  nameEn: '', nameUr: '', nameSd: '',
  locationEn: '', locationUr: '', locationSd: '',
  textEn: '', textUr: '', textSd: '',
  image: '', rating: 5,
};

export const AdminTestimonialsTab = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handlePhotoUpload = async (i, file) => {
    if (!file) return;
    setUploadingIndex(i);
    try {
      const url = await uploadImage(file, token);
      setTestimonials((prev) => prev.map((x, idx) => (idx === i ? { ...x, image: url } : x)));
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/content/home`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.data?.content) {
        const c = data.data.content;
        setTestimonials((c.testimonials || []).map((tItem) => ({
          nameEn: tItem.name?.en || '', nameUr: tItem.name?.ur || '', nameSd: tItem.name?.sd || '',
          locationEn: tItem.location?.en || '', locationUr: tItem.location?.ur || '', locationSd: tItem.location?.sd || '',
          textEn: tItem.text?.en || '', textUr: tItem.text?.ur || '', textSd: tItem.text?.sd || '',
          image: tItem.image || '', rating: tItem.rating || 5,
        })));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
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
      testimonials: testimonials.map((tItem) => ({
        name: { en: tItem.nameEn, ur: tItem.nameUr, sd: tItem.nameSd },
        location: { en: tItem.locationEn, ur: tItem.locationUr, sd: tItem.locationSd },
        text: { en: tItem.textEn, ur: tItem.textUr, sd: tItem.textSd },
        image: tItem.image,
        rating: tItem.rating,
      })),
    };
    try {
      const res = await fetch(`${API_URL}/api/admin/content/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) alert(data.message || 'Failed to save');
      else alert('Testimonials saved.');
    } catch (error) {
      console.error('Error saving testimonials:', error);
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">What Farmers Say</h2>
          </div>
          <Button size="sm" onClick={() => setTestimonials([...testimonials, { ...emptyTestimonial }])} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" /> Add Testimonial
          </Button>
        </div>
        <div className="space-y-5">
          {testimonials.map((tItem, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5 space-y-4 relative bg-gray-50/50">
              <button
                onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  {tItem.image ? (
                    <img src={tItem.image} alt={tItem.nameEn || 'Farmer'} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No photo</div>
                  )}
                </div>
                <Input placeholder="Photo URL" value={tItem.image} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, image: e.target.value } : x))} className="flex-1" />
                <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  {uploadingIndex === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploadingIndex === i}
                    onChange={(e) => handlePhotoUpload(i, e.target.files?.[0])}
                  />
                </label>
                <div className="flex items-center gap-1 flex-shrink-0 pl-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, rating: star } : x))}>
                      <Star className={`w-5 h-5 ${star <= tItem.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <Input placeholder="Name (English)" value={tItem.nameEn} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, nameEn: e.target.value } : x))} />
                <Input placeholder="Name (Urdu)" value={tItem.nameUr} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, nameUr: e.target.value } : x))} />
                <Input placeholder="Name (Sindhi)" value={tItem.nameSd} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, nameSd: e.target.value } : x))} />
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <Input placeholder="Location (English)" value={tItem.locationEn} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, locationEn: e.target.value } : x))} />
                <Input placeholder="Location (Urdu)" value={tItem.locationUr} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, locationUr: e.target.value } : x))} />
                <Input placeholder="Location (Sindhi)" value={tItem.locationSd} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, locationSd: e.target.value } : x))} />
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <Textarea placeholder="Quote (English)" rows={3} value={tItem.textEn} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, textEn: e.target.value } : x))} />
                <Textarea placeholder="Quote (Urdu)" rows={3} value={tItem.textUr} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, textUr: e.target.value } : x))} />
                <Textarea placeholder="Quote (Sindhi)" rows={3} value={tItem.textSd} onChange={(e) => setTestimonials(testimonials.map((x, idx) => idx === i ? { ...x, textSd: e.target.value } : x))} />
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <p className="text-sm text-gray-400">No custom testimonials yet — the home page shows its built-in defaults.</p>}
        </div>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-xl gap-2">
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Testimonials'}
      </Button>
    </div>
  );
};

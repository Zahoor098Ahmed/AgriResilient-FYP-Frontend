import React, { useState, useEffect } from 'react';
import { Save, MessageSquare, Phone, Share2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export const AdminFooterTab = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blurbEn, setBlurbEn] = useState('');
  const [blurbUr, setBlurbUr] = useState('');
  const [blurbSd, setBlurbSd] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressUr, setAddressUr] = useState('');
  const [addressSd, setAddressSd] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/content/footer`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.data?.content) {
        const c = data.data.content;
        setBlurbEn(c.aboutBlurb?.en || '');
        setBlurbUr(c.aboutBlurb?.ur || '');
        setBlurbSd(c.aboutBlurb?.sd || '');
        setEmail(c.email || '');
        setPhone(c.phone || '');
        setAddressEn(c.address?.en || '');
        setAddressUr(c.address?.ur || '');
        setAddressSd(c.address?.sd || '');
        setFacebook(c.socialLinks?.facebook || '');
        setTwitter(c.socialLinks?.twitter || '');
        setInstagram(c.socialLinks?.instagram || '');
        setLinkedin(c.socialLinks?.linkedin || '');
      }
    } catch (error) {
      console.error('Error fetching footer content:', error);
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
      aboutBlurb: { en: blurbEn, ur: blurbUr, sd: blurbSd },
      email,
      phone,
      address: { en: addressEn, ur: addressUr, sd: addressSd },
      socialLinks: { facebook, twitter, instagram, linkedin },
    };
    try {
      const res = await fetch(`${API_URL}/api/admin/content/footer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) alert(data.message || 'Failed to save');
      else alert('Footer content saved.');
    } catch (error) {
      console.error('Error saving footer content:', error);
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
          <MessageSquare className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-800">About Blurb</h2>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">English</Label>
            <Textarea className="mt-1" rows={2} value={blurbEn} onChange={(e) => setBlurbEn(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Urdu</Label>
            <Textarea className="mt-1" rows={2} value={blurbUr} onChange={(e) => setBlurbUr(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Sindhi</Label>
            <Textarea className="mt-1" rows={2} value={blurbSd} onChange={(e) => setBlurbSd(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-800">Contact Details</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs text-gray-500">Email</Label>
            <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Phone</Label>
            <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">Address (English)</Label>
            <Input className="mt-1" value={addressEn} onChange={(e) => setAddressEn(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Address (Urdu)</Label>
            <Input className="mt-1" value={addressUr} onChange={(e) => setAddressUr(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Address (Sindhi)</Label>
            <Input className="mt-1" value={addressSd} onChange={(e) => setAddressSd(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-800">Social Links</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Facebook</Label>
            <Input className="mt-1" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Twitter / X</Label>
            <Input className="mt-1" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Instagram</Label>
            <Input className="mt-1" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <Label className="text-xs text-gray-500">LinkedIn</Label>
            <Input className="mt-1" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." />
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-xl gap-2">
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Footer'}
      </Button>
    </div>
  );
};

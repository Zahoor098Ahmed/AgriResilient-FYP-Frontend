import React, { useState, useEffect, useCallback } from 'react';
import { Users, Scan, BarChart3, Trash2, ShieldCheck, LogOut, Mail, FileText, Info, PanelBottom, TrendingUp, Sparkles, User as UserIcon, Quote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Pagination } from './admin/Pagination';
import { AdminContactTab } from './admin/AdminContactTab';
import { AdminBlogTab } from './admin/AdminBlogTab';
import { AdminAboutTab } from './admin/AdminAboutTab';
import { AdminFooterTab } from './admin/AdminFooterTab';
import { AdminTestimonialsTab } from './admin/AdminTestimonialsTab';

const AVATAR_GRADIENTS = [
  'from-green-500 to-emerald-600',
  'from-blue-500 to-cyan-600',
  'from-purple-500 to-fuchsia-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-teal-500 to-green-600',
];

const gradientFor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

const confidenceStyle = (confidence) => {
  const pct = confidence * 100;
  if (pct >= 80) return 'bg-green-100 text-green-700';
  if (pct >= 50) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

export const AdminPanel = ({ onNavigate }) => {
  const { token, user, logout } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [detections, setDetections] = useState([]);
  const [detectionsPagination, setDetectionsPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [detectionsLoading, setDetectionsLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [usersLoading, setUsersLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [API_URL, token]);

  const fetchDetections = useCallback(async (page = 1) => {
    setDetectionsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/detections?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDetections(data.data.detections);
        setDetectionsPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching detections:', error);
    } finally {
      setDetectionsLoading(false);
    }
  }, [API_URL, token]);

  const fetchUsers = useCallback(async (page = 1) => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setUsersPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchStats();
    fetchDetections(1);
    fetchUsers(1);
  }, [fetchStats, fetchDetections, fetchUsers]);

  const handleDeleteDetection = async (id) => {
    if (!window.confirm(t('Are you sure you want to delete this detection record?', 'کیا آپ واقعی اس ڈیٹیکشن ریکارڈ کو حذف کرنا چاہتے ہیں؟', 'ڇا توهان واقعي هي ڊيٽڪشن رڪارڊ حذف ڪرڻ چاهيو ٿا؟'))) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/detections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
        fetchDetections(detectionsPagination.page);
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting detection:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(t(
      'Delete this user? Their account will be permanently removed and they will need to register again to use the site.',
      'اس صارف کو حذف کریں؟ ان کا اکاؤنٹ مستقل طور پر ہٹا دیا جائے گا۔',
      'ھن صارف کي حذف ڪريو؟ سندس اڪائونٽ مستقل طور تي ھٽايو ويندو.'
    ))) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
        fetchUsers(usersPagination.page);
        fetchStats();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const navItems = [
    { id: 'overview', label: t('Overview', 'جائزہ', 'جائزو'), icon: BarChart3 },
    { id: 'detections', label: t('Detections', 'پتہ لگانے والے', 'پتہ لڳائڻ وارا'), icon: Scan },
    { id: 'users', label: t('Users', 'صارفین', 'صارفين'), icon: Users },
    { id: 'contact', label: t('Contact Messages', 'رابطہ پیغامات', 'رابطي پيغام'), icon: Mail },
    { id: 'blog', label: t('Blog', 'بلاگ', 'بلاگ'), icon: FileText },
    { id: 'testimonials', label: t('Testimonials', 'تعریفیں', 'گواهيون'), icon: Quote },
    { id: 'about', label: t('About Page', 'صفحہ ہمارے بارے میں', 'اسان بابت صفحو'), icon: Info },
    { id: 'footer', label: t('Footer', 'فوٹر', 'فوٽر'), icon: PanelBottom },
  ];

  const maxObjectCount = stats?.commonObjects?.[0]?.count || 1;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-green-950 text-white flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6 border-b border-green-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-white leading-tight truncate">AgriResilient</h1>
              <p className="text-xs text-green-300/70">{t('Admin Console', 'ایڈمن کنسول', 'ايڊمن ڪنسول')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : 'text-green-200/70 hover:text-white hover:bg-green-900/60 border border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-green-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {(user?.name || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || t('Administrator', 'ایڈمن', 'ايڊمن')}</p>
              <p className="text-xs text-green-300/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-green-200/70 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('Logout', 'لاگ آؤٹ', 'لاگ آئوٽ')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-72 min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-700">{t('Secure Session Active', 'محفوظ سیشن فعال', 'محفوظ سيشن فعال')}</span>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'overview' && (
            statsLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600" />
              </div>
            ) : stats && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0">
                        <Scan className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm font-medium">{t('Total Detections', 'کل پتہ لگانے', 'ڪل پتہ لڳائڻ')}</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-0.5">{stats.totalDetections}</h3>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm font-medium">{t('Total Users', 'کل صارفین', 'ڪل صارفين')}</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-0.5">{stats.totalUsers}</h3>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-500 text-sm font-medium">{t('Most Detected', 'سب سے زیادہ پتہ چلا', 'سڀ کان وڌيڪ پتہ لڳيو')}</p>
                        <h3 className="text-xl font-bold text-gray-800 mt-0.5 truncate">{stats.commonObjects[0]?._id || t('N/A', 'دستیاب نہیں', 'دستياب ناهي')}</h3>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-8 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-bold text-gray-800">{t('Popular Objects', 'مقبول اشیاء', 'مقبول شيون')}</h2>
                  </div>
                  {stats.commonObjects.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">{t('No detections yet.', 'ابھی تک کوئی پتہ لگانا نہیں۔', 'اڃا تائين ڪا به ڳولا ناهي.')}</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.commonObjects.map((obj, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-medium text-gray-700 truncate">{obj._id}</span>
                              <Badge className="bg-green-100 text-green-700 flex-shrink-0 ml-2">{obj.count} {t('scans', 'اسکین', 'اسڪين')}</Badge>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                                style={{ width: `${(obj.count / maxObjectCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )
          )}

          {activeTab === 'detections' && (
            <Card className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('Recent Detections', 'حالیہ پتہ لگانے', 'تازو پتہ لڳائڻ')}</h2>
                <Badge variant="outline">{detectionsPagination.total} {t('Records', 'ریکارڈز', 'ريڪارڈز')}</Badge>
              </div>
              {detectionsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600" />
                </div>
              ) : detections.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Scan className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  {t('No detections yet.', 'ابھی تک کوئی پتہ لگانا نہیں۔', 'اڃا تائين ڪا به ڳولا ناهي.')}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">{t('Object', 'شی', 'شي')}</th>
                          <th className="px-6 py-4">{t('Confidence', 'اعتماد', 'اعتماد')}</th>
                          <th className="px-6 py-4">{t('Date', 'تاریخ', 'تاريخ')}</th>
                          <th className="px-6 py-4 text-right">{t('Action', 'عمل', 'عمل')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {detections.map((d) => (
                          <tr key={d._id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientFor(d.detectedObject || 'x')} flex items-center justify-center flex-shrink-0`}>
                                  <Scan className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-800">{d.detectedObject}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={confidenceStyle(d.confidence)}>
                                {(d.confidence * 100).toFixed(1)}%
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-sm">
                              {new Date(d.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteDetection(d._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={detectionsPagination.page}
                    pages={detectionsPagination.pages}
                    total={detectionsPagination.total}
                    limit={detectionsPagination.limit}
                    onPageChange={(p) => fetchDetections(p)}
                  />
                </>
              )}
            </Card>
          )}

          {activeTab === 'users' && (
            <Card className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('System Users', 'سسٹم صارفین', 'سسٽم صارفين')}</h2>
                <Badge variant="outline">{usersPagination.total} {t('Users', 'صارفین', 'صارفين')}</Badge>
              </div>
              {usersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600" />
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  {t('No users yet.', 'ابھی تک کوئی صارف نہیں۔', 'اڃا تائين ڪو صارف ناهي.')}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">{t('Name', 'نام', 'نالو')}</th>
                          <th className="px-6 py-4">{t('Email', 'ای میل', 'اى ميل')}</th>
                          <th className="px-6 py-4">{t('Role', 'کردار', 'ڪردار')}</th>
                          <th className="px-6 py-4">{t('Joined', 'شامل ہوا', 'شامل ٿيو')}</th>
                          <th className="px-6 py-4 text-right">{t('Action', 'عمل', 'عمل')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientFor(u.name || u.email)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                                  {(u.name || 'U')[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-800">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                            <td className="px-6 py-4">
                              <Badge className={u.role === 'admin' ? 'bg-purple-100 text-purple-700 gap-1' : 'bg-gray-100 text-gray-700 gap-1'}>
                                {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                {u.role === 'admin' ? t('Admin', 'ایڈمن', 'ايڊمن') : t('User', 'صارف', 'صارف')}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-sm">
                              {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {u._id !== user?.id && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={usersPagination.page}
                    pages={usersPagination.pages}
                    total={usersPagination.total}
                    limit={usersPagination.limit}
                    onPageChange={(p) => fetchUsers(p)}
                  />
                </>
              )}
            </Card>
          )}

          {activeTab === 'contact' && <AdminContactTab />}
          {activeTab === 'blog' && <AdminBlogTab />}
          {activeTab === 'testimonials' && <AdminTestimonialsTab />}
          {activeTab === 'about' && <AdminAboutTab />}
          {activeTab === 'footer' && <AdminFooterTab />}
        </main>
      </div>
    </div>
  );
};

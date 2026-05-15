import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Scan, BarChart3, Trash2, ShieldCheck, Calendar, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const AdminPanel = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [detections, setDetections] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, detectionsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/detections`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const statsData = await statsRes.json();
      const detectionsData = await detectionsRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) setStats(statsData.data);
      if (detectionsData.success) setDetections(detectionsData.data.detections);
      if (usersData.success) setUsers(usersData.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDetection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this detection record?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/detections/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 204) {
        setDetections(detections.filter(d => d._id !== id));
      }
    } catch (error) {
      console.error('Error deleting detection:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Control Panel</h1>
            <p className="text-gray-600">Manage your application's data and monitor performance.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview' ? 'bg-green-600' : ''}
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === 'detections' ? 'default' : 'outline'}
              onClick={() => setActiveTab('detections')}
              className={activeTab === 'detections' ? 'bg-green-600' : ''}
            >
              Detections
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
              className={activeTab === 'users' ? 'bg-green-600' : ''}
            >
              Users
            </Button>
          </div>
        </header>

        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white shadow-xl border-t-4 border-green-600">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Scan className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Detections</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalDetections}</h3>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white shadow-xl border-t-4 border-blue-600">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white shadow-xl border-t-4 border-purple-600">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Most Detected</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.commonObjects[0]?._id || 'N/A'}</h3>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-white shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Objects</h2>
              <div className="space-y-4">
                {stats.commonObjects.map((obj, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-bold text-gray-700">{obj._id}</span>
                    <Badge className="bg-green-100 text-green-700">{obj.count} scans</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'detections' && (
          <Card className="bg-white shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Recent Detections</h2>
              <Badge variant="outline">{detections.length} Records</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Object</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detections.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{d.detectedObject}</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-100 text-blue-700">
                          {(d.confidence * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleDeleteDetection(d._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="bg-white shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">System Users</h2>
              <Badge variant="outline">{users.length} Users</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge className={u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

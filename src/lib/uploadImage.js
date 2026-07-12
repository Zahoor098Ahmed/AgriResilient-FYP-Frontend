// Uploads a File to the backend and returns the absolute URL to store in an
// `image` field. Throws on failure so callers can show their own error UI.
export const uploadImage = async (file, token) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Upload failed');
  return data.data.url;
};

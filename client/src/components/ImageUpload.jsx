import { useState, useCallback } from 'react';
import API from '../api/axios';
import { HiCloudUpload, HiX, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) toast.error('Only image files are allowed');
    setFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return toast.error('Please select images first');
    setUploading(true);
    
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Images uploaded successfully');
      setFiles([]);
      if (onUploadSuccess) onUploadSuccess(data.urls);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
      <div 
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, padding: '40px 20px', textAlign: 'center',
          background: dragActive ? 'rgba(99,102,241,0.05)' : 'transparent',
          transition: 'all 0.2s', cursor: 'pointer', marginBottom: 16
        }}
      >
        <input type="file" multiple accept="image/*" onChange={handleChange} id="file-upload" style={{ display: 'none' }} />
        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HiCloudUpload style={{ fontSize: '3rem', color: dragActive ? '#6366f1' : '#64748b', marginBottom: 12 }} />
          <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '1rem', margin: '0 0 4px 0' }}>Drag & drop images here</p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>or click to browse (Max 10 images)</p>
        </label>
      </div>

      {files.length > 0 && (
        <div>
          <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 12 }}>Selected Files ({files.length})</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            {files.map((file, i) => (
              <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => removeFile(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}><HiX style={{ fontSize: 12 }} /></button>
              </div>
            ))}
          </div>
          <button onClick={uploadFiles} disabled={uploading} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {uploading ? 'Uploading...' : <><HiCheckCircle /> Upload to Cloudinary</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

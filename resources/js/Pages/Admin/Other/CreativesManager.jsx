import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Upload, Trash2, Eye, Plus, FileImage, AlertCircle, CheckCircle, X, AlertTriangle, Search, Filter, Download, Grid, List } from 'lucide-react';
import Layout from '@/Layouts/Layout';

const CreativesManager = ({ creatives = [], success, error }) => {
  // State management
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const fileInputRef = useRef(null);

  // File upload handling
  const handleFileSelect = (files) => {
    const newFiles = Array.from(files);
    const newPreviews = [];

    newFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const isLandscape = img.width > img.height;
            newPreviews.push({
              file,
              url: e.target.result,
              isLandscape,
              width: img.width,
              height: img.height,
              size: file.size,
              name: file.name
            });
            
            if (newPreviews.length === newFiles.length) {
              setPreviews(prev => [...prev, ...newPreviews]);
              setSelectedFiles(prev => [...prev, ...newFiles]);
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    router.post('/creatives', formData, {
      onSuccess: () => {
        setSelectedFiles([]);
        setPreviews([]);
        setShowUploadSection(false);
      },
      onFinish: () => setUploading(false)
    });
  };

  // Creative management
  const handleDelete = (id) => {
    router.delete(`/creatives/${id}`, {
      onSuccess: () => setDeleteConfirm(null)
    });
  };

  const toggleImageSelection = (id) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedImages.length === 0) return;
    
    selectedImages.forEach(id => {
      router.delete(`/creatives/${id}`, {
        preserveState: true,
        preserveScroll: true,
      });
    });
    setSelectedImages([]);
  };

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter and sort creatives
  const filteredCreatives = creatives
    .filter(creative => 
      creative.image.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'name':
          return a.image.localeCompare(b.image);
        default:
          return 0;
      }
    });

  const landscapeCount = previews.filter(p => p.isLandscape).length;
  const portraitCount = previews.filter(p => !p.isLandscape).length;

  return (
    <Layout>
      <Head title="Creatives Management" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Creatives Management</h1>
                <p className="text-gray-600 mt-1">Upload and manage your creative assets</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowUploadSection(!showUploadSection)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    showUploadSection 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {showUploadSection ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {showUploadSection ? 'Close Upload' : 'Upload New'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">{success}</span>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
        </div>

        {/* Upload Section */}
        {showUploadSection && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b bg-white">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Upload Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Only landscape (width > height) images will be processed</li>
                    <li>• Supported formats: JPG, JPEG, PNG, WebP</li>
                    <li>• Maximum file size: 2MB per image</li>
                    <li>• Images will be converted to WebP format for optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your images here, or click to browse
                </h3>
                <p className="text-gray-600 mb-6">
                  Select multiple images to upload at once
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Upload className="w-5 h-5" />
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* File Stats */}
              {previews.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-6 text-center mb-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{previews.length}</div>
                      <div className="text-sm text-gray-600">Total Images</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{landscapeCount}</div>
                      <div className="text-sm text-gray-600">Will be Uploaded</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{portraitCount}</div>
                      <div className="text-sm text-gray-600">Will be Skipped</div>
                    </div>
                  </div>

                  {/* File Previews */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          preview.isLandscape 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="aspect-video relative">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className={`absolute top-1 left-1 px-1 py-0.5 rounded text-xs font-medium ${
                            preview.isLandscape
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}>
                            {preview.isLandscape ? '✓' : '✗'}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-gray-900 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            {preview.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatFileSize(preview.size)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFiles([]);
                        setPreviews([]);
                      }}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading || landscapeCount === 0}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Upload {landscapeCount} Image{landscapeCount !== 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creatives.length}</div>
                  <div className="text-sm text-gray-600">Total Creatives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedImages.length}</div>
                  <div className="text-sm text-gray-600">Selected</div>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search creatives..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedImages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedImages.length} item{selectedImages.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedImages([])}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Creatives Display */}
          {filteredCreatives.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No creatives found' : 'No creatives yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters.' 
                  : 'Upload your first creative to get started.'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowUploadSection(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Upload className="w-5 h-5" />
                  Upload Creatives
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredCreatives.map((creative) => (
                <div
                  key={creative.id}
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-200 ${
                    selectedImages.includes(creative.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="aspect-video relative">
                    <img
                      src={`/assets/images/creatives/${creative.image}`}
                      alt="Creative"
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <button
                          onClick={() => window.open(`/assets/images/creatives/${creative.image}`, '_blank')}
                          className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(creative.id)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(creative.id)}
                        onChange={() => toggleImageSelection(creative.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-sm text-gray-600 truncate">
                      {creative.image}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ID: {creative.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedImages.length === filteredCreatives.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedImages(filteredCreatives.map(c => c.id));
                            } else {
                              setSelectedImages([]);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filename
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCreatives.map((creative) => (
                      <tr key={creative.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(creative.id)}
                            onChange={() => toggleImageSelection(creative.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={`/assets/images/creatives/${creative.image}`}
                            alt="Creative"
                            className="w-16 h-10 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {creative.image}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {creative.id}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(`/assets/images/creatives/${creative.image}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(creative.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Creative</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this creative? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreativesManager;
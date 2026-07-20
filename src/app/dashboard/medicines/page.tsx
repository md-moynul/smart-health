/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, Product } from '@/lib/products';

export default function MedicinesManagement() {
  const [medicines, setMedicines] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    price: '',
    category: 'Pain Relief',
    image: '',
    badge: '',
    description: '',
    dosage: '',
    manufacturer: 'SmartHealth Labs',
    inStock: true,
    requiresPrescription: false,
  });

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/admin/medicines');
      const data = await res.json();
      if (data && Array.isArray(data.products)) {
        setMedicines(data.products);
      } else if (Array.isArray(data)) {
        setMedicines(data);
      } else {
        setError(data.error || 'Failed to load medicines');
      }
    } catch (err) {
      setError('Network error fetching medicines list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMedicines();
  }, []);

  // Filter medicines
  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.genericName?.toLowerCase().includes(search.toLowerCase()) ||
        m.manufacturer?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || m.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [medicines, search, selectedCategory]);

  // Handle direct upload to Imgbb CDN
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
      } else {
        alert('Image upload failed. Please verify your Imgbb API key.');
      }
    } catch (err) {
      alert('Network error uploading image to Imgbb.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      genericName: '',
      price: '',
      category: 'Pain Relief',
      image: '',
      badge: '',
      description: '',
      dosage: '',
      manufacturer: 'SmartHealth Labs',
      inStock: true,
      requiresPrescription: false,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      genericName: product.genericName || '',
      price: String(product.price),
      category: product.category,
      image: product.image || '',
      badge: product.badge || '',
      description: product.description || '',
      dosage: product.dosage || '',
      manufacturer: product.manufacturer || 'SmartHealth Labs',
      inStock: product.inStock,
      requiresPrescription: product.requiresPrescription,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchMedicines();
      } else {
        alert(data.error || 'Failed to add medicine');
      }
    } catch (err) {
      alert('Network error adding medicine');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const res = await fetch(`/api/admin/medicines/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditModalOpen(false);
        fetchMedicines();
      } else {
        alert(data.error || 'Failed to update medicine');
      }
    } catch (err) {
      alert('Network error updating medicine');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`/api/admin/medicines/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        fetchMedicines();
      } else {
        alert(data.error || 'Failed to delete medicine');
      }
    } catch (err) {
      alert('Network error deleting medicine');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Medicines Database</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage prescription records and over-the-counter formulations.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Formulations
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white border border-zinc-150 rounded-2xl p-4 shadow-2xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by brand name, formula, or maker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-800"
          />
          <svg className="absolute left-3 top-3.5 h-4.5 w-4.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-all text-zinc-700 cursor-pointer"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="bg-white border border-zinc-150 rounded-2xl p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-zinc-200 rounded-md w-1/4" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-100 rounded-md w-full" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="border border-rose-100 bg-rose-50/50 rounded-2xl p-6 text-center text-rose-700">
          <p>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-zinc-150 rounded-2xl p-12 text-center text-zinc-500">
          <svg className="mx-auto h-12 w-12 text-zinc-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-zinc-900">No medicines found</h3>
          <p className="text-xs mt-1">Try resetting your filters or create a new formulation entry.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-150 text-sm text-left">
              <thead className="bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Brand Name</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Category</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Price</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Status</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Type</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="font-semibold text-zinc-950">{prod.name}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{prod.genericName || 'No generic name'}</div>
                    </td>
                    <td className="px-6 py-4.5 text-zinc-650">{prod.category}</td>
                    <td className="px-6 py-4.5 font-medium text-zinc-800">${prod.price.toFixed(2)}</td>
                    <td className="px-6 py-4.5">
                      {prod.inStock ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">In Stock</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-2xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      {prod.requiresPrescription ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/10">Rx Required</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-0.5 text-2xs font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-500/10">OTC</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="inline-flex p-1.5 rounded-lg text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Edit Formulation"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(prod)}
                        className="inline-flex p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Formulation"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── ADD & EDIT MODALS ─── */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-150 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-950">
                {isAddModalOpen ? 'Create New Formulation' : 'Update Formulation'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-zinc-500">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-zinc-500">Generic Formula</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Label Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, New"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Integrated Imgbb Direct upload row within dashboard modals */}
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-150 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Image Upload (Direct Imgbb Key)</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                    className="w-full text-2xs font-normal file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-2xs file:font-semibold file:bg-zinc-950 file:text-white hover:file:bg-zinc-800 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-medium">Or asset URL</label>
                  <input
                    type="text"
                    placeholder="https://i.ibb.co/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-zinc-200 text-xs font-normal focus:outline-hidden"
                  />
                </div>
                {uploadingImage && <div className="text-[10px] text-emerald-600 animate-pulse font-medium">Uploading to Imgbb servers...</div>}
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-lg border border-zinc-200 text-sm font-normal focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-4 py-1">
                <label className="flex items-center space-x-2 text-zinc-650 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center space-x-2 text-zinc-650 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.requiresPrescription}
                    onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Requires Prescription (Rx)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-5 py-2 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE MODAL ─── */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-zinc-150 shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-950">Remove Formulation?</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Are you sure you want to delete <span className="font-semibold text-zinc-800">{selectedProduct.name}</span>? This structural alteration is absolute.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-650 hover:bg-zinc-50 w-1/2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 w-1/2 text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
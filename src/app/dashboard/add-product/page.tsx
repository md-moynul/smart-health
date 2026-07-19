/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function AddProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [price, setPrice] = useState('9.99');
  const [category, setCategory] = useState('Pain Relief');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('New');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [manufacturer, setManufacturer] = useState('SmartHealth Labs');
  const [inStock, setInStock] = useState(true);
  const [requiresPrescription, setRequiresPrescription] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Free/Public Imgbb key from client environment variables
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setImage(data.data.url);
      } else {
        alert('Image upload failed. Please try a different asset or insert a URL manually.');
      }
    } catch (err) {
      alert('Network error uploading image to Imgbb.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const productPayload = {
      name,
      genericName,
      price: Number(price),
      category,
      image,
      badge,
      description,
      details: [description, `Dosage: ${dosage || 'As directed'}`, `Manufacturer: ${manufacturer}`],
      dosage,
      manufacturer,
      inStock,
      requiresPrescription,
    };

    try {
      const res = await fetch('/api/admin/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/medicines');
          router.refresh();
        }, 1500);
      } else {
        alert(data.error || 'Failed to add formulation');
        setSubmitting(false);
      }
    } catch (err) {
      alert('Network error submitting new formulation');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Add New Product</h1>
        <p className="text-sm text-zinc-505 mt-1">Configure and release a new pharmaceutical or wellness formulation.</p>
      </div>

      {success ? (
        <div className="bg-white border border-zinc-150 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs animate-scale-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 animate-[pulse_2s_infinite]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-950">Formulation Released!</h2>
          <p className="text-sm text-zinc-500 leading-normal">
            The product has been successfully registered in the database and catalogued in the shop. Redirecting to medicines directory...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* ─── Left Side: Form ─── */}
          <div className="lg:col-span-2 bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6">
            <h2 className="text-lg font-bold text-zinc-950">Product Configuration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-zinc-500">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lipitor 10mg"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-zinc-500">Generic Formula</label>
                  <input
                    type="text"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g. Atorvastatin Calcium"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
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
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Category Group</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 transition-all font-normal text-zinc-700"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Manufacturer</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Ribbon Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Rx Required"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                  />
                </div>
              </div>

              {/* Integrated Media Upload Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Upload to Imgbb</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                    className="w-full h-11 p-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-hidden focus:border-emerald-500 transition-all font-normal text-zinc-650 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-2xs file:font-semibold file:bg-zinc-950 file:text-white hover:file:bg-zinc-800 file:cursor-pointer disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Direct Asset URL</label>
                  <input
                    type="text"
                    placeholder="https://i.ibb.co/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                  />
                </div>
                {uploadingImage && (
                  <div className="col-span-1 sm:col-span-2 text-2xs font-medium text-emerald-600 flex items-center gap-1.5 px-1 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Uploading asset image to Imgbb CDN servers...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-zinc-500">Recommended Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. Take 1 tablet daily at evening"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Description &amp; Telemetry Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the medical properties, usage directives, and telemetry records..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal text-zinc-800"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-2 border-y border-zinc-100 my-4">
                <label className="flex items-center space-x-2 text-zinc-650 pointer-events-auto cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-5 w-5 rounded-md border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Product is immediately available (In Stock)</span>
                </label>

                <label className="flex items-center space-x-2 text-zinc-650 pointer-events-auto cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requiresPrescription}
                    onChange={(e) => setRequiresPrescription(e.target.checked)}
                    className="h-5 w-5 rounded-md border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Requires Doctor Prescription (Rx)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/medicines')}
                  className="px-6 h-11 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-all active:scale-[0.99]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-8 h-11 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.99]"
                >
                  {submitting ? 'Releasing Formulation...' : 'Release Formulation'}
                </button>
              </div>
            </form>
          </div>

          {/* ─── Right Side: Live Preview ─── */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
            <div className="bg-zinc-50 border border-zinc-150 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wide">Live Shop Preview</h3>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider animate-pulse flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  Updating Live
                </span>
              </div>
              
              {/* ProductCard Container */}
              <div className="flex justify-center p-2">
                <ProductCard
                  id="preview-card"
                  name={name || 'Lipitor 10mg'}
                  genericName={genericName || 'Atorvastatin Calcium'}
                  price={Number(price) || 9.99}
                  category={category}
                  image={image || ''}
                  rating={4.8}
                  reviewCount={1}
                  badge={badge || ''}
                  inStock={inStock}
                  requiresPrescription={requiresPrescription}
                />
              </div>
              
              <div className="text-zinc-500 text-2xs leading-relaxed text-center px-4">
                This card shows how your formulation will appear to public users navigating the SmartHealth OTC store.
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
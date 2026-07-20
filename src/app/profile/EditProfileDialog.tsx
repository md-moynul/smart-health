"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Person, Camera } from "@gravity-ui/icons"; 
import { authClient } from "@/lib/auth-client";

interface UserProfile {
  name?: string | null;
  image?: string | null;
  number?: string | null; 
}

interface EditProfileDialogProps {
  user: UserProfile | null | undefined;
}

const fieldBg = "bg-zinc-50";
const fieldClass = `w-full px-3 py-2 rounded-xl border border-zinc-200 ${fieldBg} text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm`;
const labelClass = "text-sm font-medium text-zinc-700";

export default function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name ?? "");
  const [phone, setPhone] = useState<string>(user?.number ?? ""); 
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const uploadToImgbb = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.success ? data.data.url : null;
    } catch (err) {
      console.error("ImgBB Upload failed", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      let finalImageUrl = avatarPreview || "";

      if (avatarFile) {
        const uploadedUrl = await uploadToImgbb(avatarFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const { data, error: updateError } = await authClient.updateUser({
        image: finalImageUrl,
        name,
      });

      if (data) {
        window.location.reload();
        setIsOpen(false);
      }
      
      if (updateError) {
        setError(updateError.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-transparent bg-zinc-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Pencil width={15} height={15} />
        Edit Profile
      </button>

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Mask */}
          <div 
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              if (!isSubmitting && !isUploading) setIsOpen(false);
            }}
          />

          {/* Dialog Box */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-150 bg-white p-6 shadow-2xl transition-all">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-150">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Person width={20} height={20} />
                </div>
                <h3 className="text-xl font-bold text-zinc-950">
                  Edit Profile
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
              
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="dialog-avatar"
                  className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-emerald-500"
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-zinc-400" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 opacity-0 transition-opacity hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </label>
                <input
                  id="dialog-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isSubmitting || isUploading}
                />
                <p className="text-xs text-zinc-500">
                  {isUploading ? "Uploading image..." : "Click circle to change photo"}
                </p>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="profile-name" className={labelClass}>Name</label>
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={fieldClass}
                  disabled={isSubmitting || isUploading}
                />
              </div>

              {/* Phone Number Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="profile-phone" className={labelClass}>Phone Number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +1234567890"
                  className={fieldClass}
                  disabled={isSubmitting || isUploading}
                />
              </div>

              {error && <p className="text-sm font-medium text-rose-500">{error}</p>}

              {/* Dialog Footer Actions */}
              <div className="mt-4 flex justify-end gap-3 border-t border-zinc-150 pt-4">
                <button
                  type="button"
                  disabled={isSubmitting || isUploading}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-650 hover:bg-zinc-50 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-colors text-xs font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Saving…"
                    : isUploading
                    ? "Uploading Image…"
                    : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
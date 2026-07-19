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

const fieldBg = "bg-[#FFF9F2] dark:bg-zinc-900";
const fieldClass = `w-full px-3 py-2 rounded-xl border border-[#EAE0D3] dark:border-[#3A332A] ${fieldBg} text-[#2B2420] dark:text-[#F4EDE4] placeholder:text-[#9C9388] focus:outline-none focus:border-[#E85D3D] focus:ring-2 focus:ring-[#E85D3D]/20 transition-all text-sm`;
const labelClass = "text-sm font-medium text-[#2B2420] dark:text-[#F4EDE4]";

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
        className="flex items-center gap-1.5 rounded-xl border border-transparent bg-[#E85D3D] px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-[#D14E30] transition-colors"
      >
        <Pencil width={15} height={15} />
        Edit Profile
      </button>

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Mask */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              if (!isSubmitting && !isUploading) setIsOpen(false);
            }}
          />

          {/* Dialog Box */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#EAE0D3] bg-white p-6 shadow-xl transition-all dark:border-[#3A332A] dark:bg-[#252019]">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#EAE0D3]/30 dark:border-[#3A332A]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E85D3D]/10 text-[#E85D3D]">
                <Person width={20} height={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#2B2420] dark:text-[#F4EDE4]">
                Edit Profile
              </h3>
            </div>

            {/* Form Body */}
            <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
              
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="dialog-avatar"
                  className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#EAE0D3] bg-[#FFF9F2] transition-colors hover:border-[#E85D3D] dark:border-[#3A332A] dark:bg-zinc-900"
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-[#9C9388]" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
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
                <p className="text-xs text-[#6B6155] dark:text-[#B8AFA2]">
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

              {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

              {/* Dialog Footer Actions */}
              <div className="mt-4 flex justify-end gap-3 border-t border-[#EAE0D3]/30 dark:border-[#3A332A]/30 pt-4">
                <button
                  type="button"
                  disabled={isSubmitting || isUploading}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="rounded-xl bg-[#E85D3D] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#D14E30] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
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
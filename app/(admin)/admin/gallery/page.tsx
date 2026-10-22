"use client";

import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  Images,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import ApiMethod from "@/services/api-method";

interface GalleryItem {
  _id: string;
  img_url: string;
  position: "home-carousal" | "gallery";
  is_active: boolean;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<"home-carousal" | "gallery">("gallery");
  const [isActive, setIsActive] = useState(true);
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string>("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await ApiMethod.get("/api/gallery?all=true");
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error("Failed to load gallery items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileSelect = (file: File) => {
    setError("");
    setSuccessMsg("");

    // Validate type on client side
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP, GIF, SVG, AVIF).");
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds the 5MB limit. Please choose a smaller image.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearSelected = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccessMsg("");

    try {
      // 1. Upload image file via /api/upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await ApiMethod.upload("/api/upload?folder=gallery", formData);
      if (!uploadRes.success) {
        setError(uploadRes.message || "Upload failed");
        return;
      }

      const uploadedUrl = uploadRes.data.url;
      setLastUploadedUrl(uploadedUrl);

      // 2. Save image to Gallery model
      const galleryRes = await ApiMethod.post("/api/gallery", {
        img_url: uploadedUrl,
        position,
        is_active: isActive,
      });

      if (!galleryRes.success) {
        setError(galleryRes.message || "Failed to save to gallery");
        return;
      }

      setSuccessMsg("Image uploaded and added to gallery successfully!");
      handleClearSelected();
      await fetchItems();
    } catch {
      setError("Something went wrong during upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const res = await ApiMethod.put(`/api/gallery/${item._id}`, {
        is_active: !item.is_active,
      });
      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it._id === item._id ? { ...it, is_active: !it.is_active } : it
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await ApiMethod.delete(`/api/gallery/${item._id}`);
      if (res.success) {
        setItems((prev) => prev.filter((it) => it._id !== item._id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredItems = items.filter((item) => {
    if (filterPosition === "all") return true;
    return item.position === filterPosition;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Images className="w-8 h-8 text-brand-600" />
          Gallery & Image Media Manager
        </h1>
        <p className="mt-1 text-slate-500">
          Upload and manage clinic photos, banner carousel slides, and website media.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-brand-600" />
          Upload New Image
        </h2>

        <form onSubmit={handleUploadAndSave} className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-brand-500 bg-brand-50"
                : "border-slate-300 hover:border-brand-400 bg-slate-50/50 hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group max-w-sm rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    className="max-h-60 w-auto object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold px-3 py-1.5 bg-brand-600 rounded-full">
                      Click to change image
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">{selectedFile?.name}</p>
                  <p>
                    Size: {selectedFile ? formatFileSize(selectedFile.size) : ""} &bull; Type:{" "}
                    {selectedFile?.type}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSelected();
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
                >
                  Remove selection
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Click to select an image, or drag & drop it here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPEG, PNG, WebP, GIF, SVG, AVIF (Max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Display Position *
              </label>
              <select
                value={position}
                onChange={(e) =>
                  setPosition(e.target.value as "home-carousal" | "gallery")
                }
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
              >
                <option value="gallery" className="text-slate-900">
                  Clinic Gallery (/gallery)
                </option>
                <option value="home-carousal" className="text-slate-900">
                  Home Carousel (Hero Slider)
                </option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Select where this image should be shown on the website.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Visibility Status
              </label>
              <div className="flex items-center h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span>Active (Visible on website)</span>
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Inactive images remain uploaded but won&apos;t appear publicly.
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </div>
              {lastUploadedUrl && (
                <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100 text-xs">
                  <span className="font-mono text-slate-700 truncate flex-1">
                    {lastUploadedUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lastUploadedUrl)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition cursor-pointer"
                  >
                    {copiedUrl === lastUploadedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy URL
                      </>
                    )}
                  </button>
                  <a
                    href={lastUploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-emerald-700 hover:text-emerald-900"
                    title="Open Image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end gap-3">
            {selectedFile && (
              <button
                type="button"
                onClick={handleClearSelected}
                disabled={uploading}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Items Grid & Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Uploaded Gallery Images</h2>
            <p className="text-xs text-slate-500">
              Total {items.length} image{items.length === 1 ? "" : "s"} uploaded
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <button
              onClick={() => setFilterPosition("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterPosition === "all"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilterPosition("home-carousal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterPosition === "home-carousal"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home Carousel ({items.filter((i) => i.position === "home-carousal").length})
            </button>
            <button
              onClick={() => setFilterPosition("gallery")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterPosition === "gallery"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Gallery ({items.filter((i) => i.position === "gallery").length})
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Images className="w-6 h-6" />
              </div>
              <p className="text-slate-600 font-semibold">No images found</p>
              <p className="text-slate-400 text-xs mt-1">
                Upload your first image above to display it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img_url}
                      alt="Uploaded media"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Position Badge */}
                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                      {item.position === "home-carousal" ? "Home Carousel" : "Clinic Gallery"}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`absolute top-2 right-2 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                        item.is_active
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-400 text-white"
                      }`}
                    >
                      {item.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {/* Body & Actions */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    {/* URL row */}
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <span className="truncate flex-1 font-mono">{item.img_url}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.img_url)}
                        className="p-1 text-slate-500 hover:text-brand-600 transition cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedUrl === item.img_url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={item.img_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-500 hover:text-brand-600 transition"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          item.is_active
                            ? "text-slate-600 hover:bg-slate-200"
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                      >
                        {item.is_active ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Make Active
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

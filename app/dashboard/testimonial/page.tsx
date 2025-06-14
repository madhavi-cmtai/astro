"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTestimonials,
  selectTestimonials,
  selectError,
  selectLoading,
  deleteTestimonial,
  addTestimonial,
  updateTestimonial,
} from "@/lib/redux/features/testimonialSlice";
import { AppDispatch } from "@/lib/redux/store";

interface TestimonialItem {
  id: string;
  name: string;
  description?: string;
  media: string;
  rating: number;
  spread: string;
  status: "active" | "inactive";
  createdOn?: string;
  updatedOn?: string;
}

export default function TestimonialPage() {
  const dispatch = useDispatch<AppDispatch>();
  const testimonialItems = useSelector(selectTestimonials);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectLoading);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TestimonialItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<TestimonialItem | null>(null);

  const [mediaType, setMediaType] = useState<"image" | "video" | "no-media" | "">("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    media: "",
    spread: "",
    rating: 0,
    status: "active",
  });

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const filteredItems = useMemo(
    () =>
      (Array.isArray(testimonialItems) ? testimonialItems : []).filter((item) =>
        (item.name ?? "").toLowerCase().includes((search ?? "").toLowerCase())
      ),
    [testimonialItems, search]
  );

  const openAddModal = () => {
    setEditItem(null);
    setForm({
      name: "",
      description: "",
      media: "",
      spread: "",
      rating: 0,
      status: "active",
    });
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType("");
    setModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      media: item.media,
      spread: item.spread,
      rating: item.rating,
      status: item.status,
    });

    if (item.media?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      setMediaType("image");
    } else if (item.media?.match(/\.(mp4|webm|ogg)$/i)) {
      setMediaType("video");
    } else {
      setMediaType("no-media");
    }

    setMediaPreview(item.media || null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem?.id) return toast.error("Invalid testimonial ID.");
    setLoading(true);
    try {
      await dispatch(deleteTestimonial(deleteItem.id)).unwrap();
      toast.success("Deleted!");
    } catch {
      toast.error("Failed to delete.");
    }
    setLoading(false);
    setDeleteItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      const { name, description, spread, rating, status } = form;

      if (!name || !mediaType) {
        toast.error("Please fill all required fields.");
        setLoading(false);
        return;
      }

      formData.append("name", name);
      formData.append("status", status);

      if (mediaType === "image") {
        if (!description || !rating || (!editItem && !mediaFile)) {
          toast.error("Image type requires description, rating and media.");
          setLoading(false);
          return;
        }
        if (mediaFile) formData.append("media", mediaFile);
        formData.append("description", description);
        formData.append("rating", String(rating));
      }

      if (mediaType === "video") {
        if (!editItem && !mediaFile) {
          toast.error("Video file is required.");
          setLoading(false);
          return;
        }
        if (mediaFile) formData.append("media", mediaFile);
      }

      if (mediaType === "no-media") {
        if (!description || !rating || !spread) {
          toast.error("No-media type requires description, rating, and spread.");
          setLoading(false);
          return;
        }
        formData.append("description", description);
        formData.append("rating", String(rating));
        formData.append("spread", spread);
      }

      if (editItem) {
        formData.append("id", editItem.id);
        await dispatch(updateTestimonial({ formData, id: editItem.id })).unwrap();
        toast.success("Updated!");
      } else {
        await dispatch(addTestimonial(formData)).unwrap();
        toast.success("Added!");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setModalOpen(false);
      setEditItem(null);
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType("");
      setForm({
        name: "",
        description: "",
        media: "",
        spread: "",
        rating: 0,
        status: "active",
      });
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return toast.error("Max file size is 50MB.");
    console.log("Selected file:", file);
    const previewURL = URL.createObjectURL(file);
    console.log("Preview URL:", previewURL);
    setMediaFile(file);
    setMediaPreview(previewURL);
  };

  const renderMediaPreview = (url: string | null) => {
    if (!url) return null;
    if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return <img src={url} className="w-full h-40 object-cover rounded-md shadow border" />;
    } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return <video src={url} controls className="w-full h-40 rounded-md shadow border" />;
    }
    return null;
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
          Testimonials
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="relative w-full sm:w-72">
            <Input
              placeholder="Search Testimonials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4" /> Add Testimonials
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No testimonials found.</div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition p-4 flex flex-col gap-2"
            >
              {renderMediaPreview(item.media)}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditModal(item)}
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteItem(item)}
                  aria-label="Delete"
                  disabled={loading}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            </DialogHeader>

            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as any)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">-- Choose Media Type --</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="no-media">No Media</option>
            </select>

            {mediaType && (
              <>
                <Input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                {(mediaType === "image" || mediaType === "no-media") && (
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full border p-2 rounded"
                    required
                  />
                )}
                {(mediaType === "image" || mediaType === "no-media") && (
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Rating"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: +e.target.value }))}
                    required
                  />
                )}
                {mediaType === "no-media" && (
                  <Input
                    placeholder="Spread"
                    value={form.spread}
                    onChange={(e) => setForm((f) => ({ ...f, spread: e.target.value }))}
                    required
                  />
                )}
                {(mediaType === "image" || mediaType === "video") && (
                  <div>
                    <input
                      type="file"
                      accept={mediaType === "image" ? "image/*" : "video/*"}
                      ref={fileInputRef}
                      onChange={handleMediaChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                    />
                    {renderMediaPreview(mediaPreview)}
                  </div>
                )}
              </>
            )}

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editItem ? "Update" : "Add"}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{deleteItem?.name}</strong>?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Delete
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" type="button">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

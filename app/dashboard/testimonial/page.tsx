"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  title: string;
  media: string;
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
  const [form, setForm] = useState({ title: "", media: "" });
  const [deleteItem, setDeleteItem] = useState<TestimonialItem | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const filteredItems = useMemo(
    () =>
      (Array.isArray(testimonialItems) ? testimonialItems : []).filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      ),
    [testimonialItems, search]
  );

  const openAddModal = () => {
    setEditItem(null);
    setForm({ title: "", media: "" });
    setMediaFile(null);
    setMediaPreview(null);
    setModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditItem(item);
    setForm({ title: item.title, media: item.media });
    setMediaPreview(item.media);
    setMediaFile(null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/routes/testimonials?id=${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Media deleted!");
      dispatch(fetchTestimonials());
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete media.");
    }

    setLoading(false);
    setDeleteItem(null);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      let response;

      if (editItem) {
        formData.append("id", editItem.id); // for update
        response = await fetch("/api/routes/testimonials", {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/routes/testimonials", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) throw new Error("Failed to save media");

      toast.success(editItem ? "Media updated!" : "Media added!");

      setModalOpen(false);
      setMediaFile(null);
      setMediaPreview(null);
      dispatch(fetchTestimonials()); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to save media.");
    } finally {
      setLoading(false);
    }
  };


  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds 50MB limit.");
      return;
    }

    setMediaFile(file);
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
  };
  
  
  const renderMediaPreview = (url: string | null) => {
    if (!url) return null;
    if (url.match(/\.(jpeg|jpg|png|gif)$/)) {
      return <img src={url} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2 border" />;
    } else if (url.match(/\.(mp4|webm|ogg)$/)) {
      return <video src={url} controls className="w-full h-40 object-cover rounded-lg mb-2 border" />;
    } else if (url.match(/\.(mp3|wav|ogg)$/)) {
      return <audio src={url} controls className="w-full rounded-lg mb-2" />;
    }
    return <div className="text-gray-500">Unsupported format</div>;
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]">Testimonials</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="relative w-full sm:w-72">
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add Media
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No media found.</div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                {renderMediaPreview(item.media)}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold mb-1">{item.title}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(item)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteItem(item)}
                    disabled={loading}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Media" : "Add Media"}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium">Upload Media (max 50MB)</label>
              {renderMediaPreview(mediaPreview)}
              <input
                type="file"
                accept="image/*,audio/*,video/*"
                ref={fileInputRef}
                onChange={handleMediaChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e63946]/10 file:text-[#e63946]"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} {editItem ? "Update" : "Add"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#e63946]">{deleteItem?.title}</span>? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

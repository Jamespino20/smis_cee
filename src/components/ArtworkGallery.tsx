"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface Artwork {
  id: string;
  title: string;
  artistName: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
}

export default function ArtworkGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtworks(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 30 * 1024 * 1024) {
      setError("File must be under 30MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Only JPEG, PNG, GIF, and WebP images are allowed");
      return;
    }

    setError(null);
    setFile(selected);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artistName.trim() || !file || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("artistName", artistName.trim());
      formData.append("file", file);
      if (description.trim()) {
        formData.append("description", description.trim());
      }

      const res = await fetch("/api/artworks", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newArtwork = await res.json();
        setArtworks((prev) => [newArtwork, ...prev]);
        setTitle("");
        setArtistName("");
        setFile(null);
        setPreview(null);
        setDescription("");
        setSubmitted(true);
        setTimeout(() => {
          setShowForm(false);
          setSubmitted(false);
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to upload artwork");
      }
    } catch {
      setError("Failed to upload artwork");
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display text-2xl sm:text-3xl text-cream">
            Gallery of Wishes
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-4 py-2 font-serif text-cream text-sm transition-colors"
          >
            {showForm ? "Cancel" : "Share Art"}
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-serif text-cream/60 text-sm mb-1 block">
                      Artwork Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your art a title..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors text-base"
                    />
                  </div>
                  <div>
                    <label className="font-serif text-cream/60 text-sm mb-1 block">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Your name..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-serif text-cream/60 text-sm mb-1 block">
                    Image File (max 30MB)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white/5 border border-dashed border-white/20 rounded-lg px-4 py-8 font-serif text-cream text-center cursor-pointer hover:border-sunset-gold/50 hover:bg-white/5 transition-all"
                  >
                    {preview && file ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <p className="text-cream/80">{file.name}</p>
                          <p className="text-cream/40 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                        <p className="text-sunset-gold text-xs">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream/40">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        <p className="text-cream/60 text-sm">
                          Click to upload an image
                        </p>
                        <p className="text-cream/30 text-xs">
                          JPEG, PNG, GIF, or WebP — up to 30MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-serif text-cream/60 text-sm mb-1 block">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about this piece..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors resize-none text-base"
                  />
                </div>

                {error && (
                  <p className="font-serif text-red-400 text-sm">{error}</p>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting || !file}
                  className="w-full bg-gradient-to-r from-vine-green/80 to-sakura-pink/80 text-twilight-deep font-display text-sm tracking-widest uppercase py-3 rounded-lg hover:from-vine-green hover:to-sakura-pink transition-all disabled:opacity-50"
                >
                  {submitting ? "Uploading..." : "Submit Artwork"}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              >
                <p className="font-serif text-vine-green text-lg mb-2">
                  Your artwork has been submitted.
                </p>
                <p className="font-serif text-cream/50 text-sm">
                  Thank you for sharing your gift with Vestia.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="font-serif text-cream/40 text-sm italic">
              Loading artworks from Vestia...
            </p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="font-serif text-cream/40 text-sm italic mb-2">
              The gallery awaits its first masterpiece.
            </p>
            <p className="font-serif text-cream/30 text-xs">
              Be the first to share your art with Smiscee.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork, i) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-sunset-gold/30 transition-colors"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-display text-sunset-gold text-sm mb-1">
                    {artwork.title}
                  </h4>
                  <p className="font-serif text-cream/60 text-xs">
                    by {artwork.artistName}
                  </p>
                  {artwork.description && (
                    <p className="font-serif text-cream/40 text-xs mt-2 italic">
                      {artwork.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  MAX_PHOTOS,
  UPLOAD_MAX_EDGE,
  UPLOAD_MAX_MB,
  UPLOAD_QUALITY,
} from '@/lib/photos';

const BUCKET = 'car-photos';

/**
 * Uploads straight from the browser to Supabase Storage.
 *
 * The signed-in session is what satisfies the storage RLS policy, so this
 * only works for a logged-in owner — exactly as intended. The resulting URLs
 * live in a hidden input so they submit with the rest of the form.
 *
 * Every photo is resized here before it leaves the phone: a 6 MB, 4000px
 * camera original becomes a ~400 KB, 2000px JPEG. The owner never has to
 * think about it, and the car page loads in a fraction of the time.
 */
export default function PhotoUploader({
  name = 'photos',
  initial = [],
}: {
  name?: string;
  initial?: string[];
}) {
  const [photos, setPhotos] = useState<string[]>(initial);
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const room = MAX_PHOTOS - photos.length;
  const full = room <= 0;

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    const picked = Array.from(files);
    const chosen = picked.slice(0, room);
    if (picked.length > room) {
      setError(
        room === 0
          ? `This car already has the maximum of ${MAX_PHOTOS} photos. Remove one to add another.`
          : `Only ${room} more ${room === 1 ? 'photo fits' : 'photos fit'} — the first ${room} were added.`,
      );
    }
    if (chosen.length === 0) return;

    setBusy({ done: 0, total: chosen.length });
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const [i, file] of chosen.entries()) {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > UPLOAD_MAX_MB * 1024 * 1024) {
        setError(`"${file.name}" is over ${UPLOAD_MAX_MB} MB.`);
        continue;
      }

      const blob = await shrink(file);
      // shrink() hands back the original when it cannot re-encode, so the
      // extension and content type follow whatever actually came out.
      const isJpeg = blob.type === 'image/jpeg';
      const ext = isJpeg ? 'jpg' : file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, {
          cacheControl: '31536000',
          contentType: blob.type || file.type,
          upsert: false,
        });

      if (upErr) {
        setError(upErr.message);
      } else {
        uploaded.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      }
      setBusy({ done: i + 1, total: chosen.length });
    }

    setPhotos((p) => [...p, ...uploaded].slice(0, MAX_PHOTOS));
    setBusy(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const remove = (url: string) => {
    setError(null);
    setPhotos((p) => p.filter((x) => x !== url));
  };
  const makeCover = (url: string) => setPhotos((p) => [url, ...p.filter((x) => x !== url)]);
  const move = (from: number, to: number) =>
    setPhotos((p) => {
      if (to < 0 || to >= p.length) return p;
      const next = [...p];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(photos)} />

      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-slate-300">
          <span className="font-600 tabular-nums text-white">{photos.length}</span>
          <span className="text-slate-500"> / {MAX_PHOTOS} photos</span>
        </p>
        {/* A slim meter — the limit is visible before anyone hits it. */}
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: MAX_PHOTOS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-5 rounded-full transition-colors ${
                i < photos.length ? 'bg-accent' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((url, i) => (
          <div
            key={url}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-ink-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />

            <span
              className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-600 uppercase tracking-wider ${
                i === 0 ? 'bg-accent text-white' : 'bg-black/60 text-slate-200'
              }`}
            >
              {i === 0 ? 'Cover' : i + 1}
            </span>

            {/* Always visible on touch screens; revealed on hover elsewhere. */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/85 to-transparent p-2 pt-6 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              <div className="flex gap-1">
                <IconBtn label="Move earlier" onClick={() => move(i, i - 1)} disabled={i === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="Move later"
                  onClick={() => move(i, i + 1)}
                  disabled={i === photos.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </IconBtn>
              </div>
              <div className="flex gap-1">
                {i !== 0 && (
                  <IconBtn label="Make this the cover photo" onClick={() => makeCover(url)}>
                    <Star className="h-4 w-4" />
                  </IconBtn>
                )}
                <IconBtn label="Remove photo" onClick={() => remove(url)} danger>
                  <X className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          </div>
        ))}

        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!!busy}
            className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-white/20 text-slate-400 transition-colors hover:border-accent/50 hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? (
              <span className="flex flex-col items-center gap-2 text-xs">
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading {busy.done}/{busy.total}
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-xs">
                <ImagePlus className="h-5 w-5" />
                Add photos
                <span className="text-slate-600">{room} left</span>
              </span>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Up to {MAX_PHOTOS} photos. The first is the cover shown in listings. A
        good set: front, rear, side, interior, boot, and the dashboard with the
        odometer on. Photos are resized automatically — upload straight from
        your phone.
      </p>

      {error && (
        <p role="alert" className="mt-2 text-xs text-accent-glow">
          {error}
        </p>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-7 w-7 place-items-center rounded-full text-white transition-colors disabled:opacity-30 ${
        danger ? 'bg-accent/90 hover:bg-accent' : 'bg-white/15 hover:bg-white/30'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Downscale to UPLOAD_MAX_EDGE on the long side and re-encode as JPEG.
 *
 * createImageBitmap honours the photo's EXIF orientation, so a portrait shot
 * from a phone does not arrive sideways. If the browser cannot decode the
 * file (some HEIC on desktop), the original goes up untouched rather than
 * failing the upload.
 */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, UPLOAD_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', UPLOAD_QUALITY),
    );
    // Never upload something bigger than what we started with.
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

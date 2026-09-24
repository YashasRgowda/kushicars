'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EASE } from '@/components/ui/motion';

const MAX_PHOTOS = 8;
const MAX_BYTES = 6 * 1024 * 1024;

/**
 * Optional photographs of the car being sold.
 *
 * These go into the PRIVATE sell-photos bucket, so what is stored is a path,
 * not a public URL — a stranger's number plate and driveway should not be on
 * an open CDN. Previews are local object URLs and never leave the browser.
 *
 * Anon may upload and nothing else; only an authenticated session can read
 * these back. See supabase/002_leads.sql.
 */
export default function PhotoUpload({
  paths,
  onChange,
}: {
  paths: string[];
  onChange: (paths: string[]) => void;
}) {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const room = MAX_PHOTOS - paths.length;
    if (room <= 0) {
      setError(`That is the maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    const chosen = Array.from(files).slice(0, room);
    const tooBig = chosen.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is over 6 MB. Most phone cameras let you send a smaller copy.`);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const added: string[] = [];
    const nextPreviews: Record<string, string> = {};

    for (const file of chosen) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('sell-photos')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (upErr) {
        console.error('[PhotoUpload]', upErr.message);
        setError('One of those would not upload. You can send photos on WhatsApp instead.');
        continue;
      }
      added.push(path);
      nextPreviews[path] = URL.createObjectURL(file);
    }

    setPreviews((p) => ({ ...p, ...nextPreviews }));
    onChange([...paths, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (path: string) => {
    // The object stays in the bucket — anon cannot delete, by design, and an
    // orphaned file is a far smaller problem than a public delete endpoint.
    const url = previews[path];
    if (url) URL.revokeObjectURL(url);
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
    onChange(paths.filter((p) => p !== path));
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[13px] font-500 text-slate-300">Photos of the car</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
          Optional · {paths.length}/{MAX_PHOTOS}
        </span>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
        Four is plenty: front three-quarter, rear three-quarter, the dashboard
        with the odometer showing, and the interior. Good photos usually move a
        quote up, not down.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {paths.map((path) => (
            <motion.div
              key={path}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-ink-850"
            >
              {previews[path] ? (
                <img src={previews[path]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-slate-600">
                  <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(path)}
                aria-label="Remove this photo"
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/65 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {paths.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="grid aspect-square place-items-center rounded-xl border border-dashed border-white/15 text-slate-500 transition-colors duration-300 hover:border-white/35 hover:text-white disabled:cursor-wait"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.5} />
            ) : (
              <span className="flex flex-col items-center gap-1.5">
                <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[11px]">Add</span>
              </span>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        onChange={(e) => pick(e.target.files)}
        className="sr-only"
      />

      {error && <p className="mt-3 text-[13px] text-accent-soft">{error}</p>}
    </div>
  );
}

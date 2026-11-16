"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addPhoto, deletePhoto, reorderPhotos } from "@/app/admin/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PHOTO_BUCKET } from "@/lib/supabase/env";

export type AdminPhoto = { id: string; url: string };

const MAX_SIDE = 1920;

/** Shrinks a phone photo to at most 1920px on the long side, as JPEG. */
async function resize(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process photo"))), "image/jpeg", 0.82),
  );
}

/** Upload, delete and reorder listing photos. The first photo is the cover. */
export function PhotoManager({ listingId, photos }: { listingId: string; photos: AdminPhoto[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const supabase = createBrowserSupabase();
    let done = 0;
    try {
      for (const file of Array.from(files)) {
        setStatus(`Uploading ${done + 1} of ${files.length}…`);
        const blob = await resize(file);
        const path = `${listingId}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw new Error(error.message);
        await addPhoto(listingId, path);
        done++;
      }
      setStatus(`${done} photo${done === 1 ? "" : "s"} added.`);
    } catch (e) {
      setStatus(`Upload stopped: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
      router.refresh();
    }
  }

  function move(index: number, dir: -1 | 1) {
    const ids = photos.map((p) => p.id);
    const j = index + dir;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    startTransition(async () => {
      await reorderPhotos(listingId, ids);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this photo?")) return;
    startTransition(async () => {
      await deletePhoto(id);
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-[1.25rem] border border-line bg-white/60 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Photos</h2>
        <label className="btn-sheen inline-flex min-h-12 cursor-pointer items-center rounded-full px-6 font-semibold text-white has-[:disabled]:opacity-60">
          {busy ? "Uploading…" : "+ Add photos"}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={busy}
            onChange={(e) => upload(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>
      <p className="text-xs text-muted">
        JPEG, PNG or WebP. Photos are resized before upload. The first photo is the cover.
      </p>
      {status && (
        <p aria-live="polite" className="text-sm font-semibold">
          {status}
        </p>
      )}
      {photos.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-line p-6 text-center text-sm text-muted">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.id} className="flex flex-col gap-2 rounded-[12px] border border-line bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails, no optimisation needed */}
              <img src={p.url} alt={`Photo ${i + 1}`} className="aspect-[4/3] w-full rounded-[8px] object-cover" />
              <div className="flex items-center justify-between gap-1 text-sm">
                <span className="font-semibold">{i === 0 ? "Cover" : `#${i + 1}`}</span>
                <span className="flex gap-1">
                  <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)} className="size-9 rounded-full border border-line disabled:opacity-30">←</button>
                  <button type="button" aria-label="Move later" disabled={i === photos.length - 1} onClick={() => move(i, 1)} className="size-9 rounded-full border border-line disabled:opacity-30">→</button>
                  <button type="button" aria-label="Delete photo" onClick={() => remove(p.id)} className="size-9 rounded-full border border-ember/40 text-ember">✕</button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

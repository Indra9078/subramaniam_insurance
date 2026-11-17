"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addMyPhoto, deleteMyPhoto, reorderMyPhotos } from "@/app/[lang]/account/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PHOTO_BUCKET } from "@/lib/supabase/env";
import { resizeImage } from "@/lib/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export type UserPhoto = { id: string; url: string };

/** Upload, delete and reorder the photos of the visitor's own pending listing. */
export function UserPhotos({ listingId, photos, dict }: { listingId: string; photos: UserPhoto[]; dict: Dictionary }) {
  const f = dict.listingForm;
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
      for (const file of Array.from(files).slice(0, 10 - photos.length)) {
        setStatus(`${f.adding} ${done + 1}/${files.length}`);
        const blob = await resizeImage(file);
        const path = `${listingId}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw new Error(error.message);
        await addMyPhoto(listingId, path);
        done++;
      }
      setStatus("");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : dict.account.errors.generic);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
      router.refresh();
    }
  }

  function move(i: number, dir: -1 | 1) {
    const ids = photos.map((p) => p.id);
    [ids[i], ids[i + dir]] = [ids[i + dir], ids[i]];
    startTransition(async () => {
      await reorderMyPhotos(listingId, ids);
      router.refresh();
    });
  }
  function remove(id: string) {
    if (!window.confirm(f.deletePhoto + "?")) return;
    startTransition(async () => {
      await deleteMyPhoto(id);
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{f.photosTitle}</h2>
        {photos.length < 10 && (
          <label className="btn-sheen inline-flex min-h-12 cursor-pointer items-center rounded-full px-6 font-semibold text-white has-[:disabled]:opacity-60">
            {busy ? f.adding : f.add}
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(e) => upload(e.target.files)} className="sr-only" />
          </label>
        )}
      </div>
      <p className="text-xs text-muted">{f.photoHint}</p>
      {status && <p aria-live="polite" className="text-sm font-semibold text-ember">{status}</p>}
      {photos.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-line p-6 text-center text-sm text-muted">{f.noPhotos}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.id} className="flex flex-col gap-2 rounded-[12px] border border-line p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- own uploads, small previews */}
              <img src={p.url} alt={`${i + 1}`} className="aspect-[4/3] w-full rounded-[8px] object-cover" />
              <div className="flex items-center justify-between gap-1 text-sm">
                <span className="font-semibold">{i === 0 ? f.cover : `#${i + 1}`}</span>
                <span className="flex gap-1">
                  <button type="button" aria-label={f.moveEarlier} disabled={i === 0} onClick={() => move(i, -1)} className="size-9 rounded-full border border-line disabled:opacity-30">←</button>
                  <button type="button" aria-label={f.moveLater} disabled={i === photos.length - 1} onClick={() => move(i, 1)} className="size-9 rounded-full border border-line disabled:opacity-30">→</button>
                  <button type="button" aria-label={f.deletePhoto} onClick={() => remove(p.id)} className="size-9 rounded-full border border-ember/40 text-ember">✕</button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

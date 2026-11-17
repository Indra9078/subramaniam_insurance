"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProductImage } from "@/app/admin/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PRODUCT_BUCKET } from "@/lib/supabase/env";
import { resizeImage } from "@/lib/image";

/** Upload, replace or remove the image of one plan. */
export function ProductImage({ productId, url }: { productId: string; url: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const blob = await resizeImage(file, 1600);
      const path = `${productId}/${crypto.randomUUID()}.jpg`;
      const { error } = await createBrowserSupabase().storage.from(PRODUCT_BUCKET).upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw new Error(error.message);
      await setProductImage(productId, path);
      setStatus("Image saved.");
    } catch (e) {
      setStatus(`Upload stopped: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
      router.refresh();
    }
  }

  function remove() {
    if (!window.confirm("Remove this image? The plan will show a drawing instead.")) return;
    startTransition(async () => {
      await setProductImage(productId, null);
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-[1.25rem] border border-line bg-white/60 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Plan image</h2>
        <label className="btn-sheen inline-flex min-h-12 cursor-pointer items-center rounded-full px-6 font-semibold text-white has-[:disabled]:opacity-60">
          {busy ? "Uploading…" : url ? "Replace image" : "+ Add image"}
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} className="sr-only" />
        </label>
      </div>
      <p className="text-xs text-muted">JPEG, PNG or WebP, resized before upload. A wide picture (3:2) looks best on the card.</p>
      {status && <p aria-live="polite" className="text-sm font-semibold">{status}</p>}
      {url ? (
        <div className="flex flex-wrap items-end gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview, no optimisation needed */}
          <img src={url} alt="Plan" className="aspect-[3/2] w-full max-w-xs rounded-[12px] border border-line object-cover" />
          <button type="button" onClick={remove} className="min-h-11 rounded-full border border-ember/40 px-5 text-sm font-semibold text-ember hover:bg-ember hover:text-white">
            Remove image
          </button>
        </div>
      ) : (
        <p className="rounded-[12px] border border-dashed border-line p-6 text-center text-sm text-muted">No image yet. The card shows a drawing for the category.</p>
      )}
    </section>
  );
}

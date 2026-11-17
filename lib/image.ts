/** Browser-side helpers for photo uploads. */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const ACCEPTED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

/** Shrinks a phone photo to at most `maxSide` px on the long side, as JPEG. Throws if the file is not a usable image. */
export async function resizeImage(file: File, maxSide = 1920, quality = 0.82): Promise<Blob> {
  if (!ACCEPTED_IMAGES.includes(file.type)) throw new Error("Only JPEG, PNG or WebP photos are allowed.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("This photo is too large (over 15 MB).");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process the photo."))), "image/jpeg", quality),
  );
}

// HEIC/HEIF (iPhone photos) to JPEG before upload: many mail programs cannot open HEIC. Re-encoding
// also drops the photo's metadata, such as the location.

const HEIC_TYPES = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']
const JPEG_QUALITY = 0.9
/** Larger HEIC files are refused before decoding. */
export const MAX_HEIC_BYTES = 50 * 1024 * 1024

/** Some browsers give HEIC no type; the extension decides then. */
export function isHeicFile(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || /\.hei[cf]$/i.test(file.name)
}

async function decodeNatively(file: File): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
    bitmap.close()
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  } catch {
    return null
  }
}

/** Safari decodes HEIC itself; other browsers load heic-to on demand (its CSP build: no eval). */
export async function heicToJpeg(file: File): Promise<File> {
  let jpeg = await decodeNatively(file)

  if (!jpeg) {
    const {heicTo} = await import('heic-to/csp')
    jpeg = await heicTo({blob: file, type: 'image/jpeg', quality: JPEG_QUALITY})
  }

  return new File([jpeg], `${file.name.replace(/\.hei[cf]$/i, '')}.jpg`, {type: 'image/jpeg'})
}

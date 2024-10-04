import { getImagesPath } from '@/lib/firebase'
import Link from 'next/link'

export default async function GalleryPage() {
  const images = await getImagesPath()

  return (
    <main className="flex h-screen w-full flex-col items-center gap-4 p-28">
      <h1>Gallery</h1>
      <Link
        className="rounded-md bg-zinc-300 px-2 py-1 text-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-100 disabled:opacity-50"
        href="/"
      >
        Adicionar imagem
      </Link>
      <div className="flex flex-wrap gap-4">
        {images?.map(image => (
          <img
            key={image}
            src={image}
            className="size-28 rounded-md bg-zinc-300"
            alt="uploaded"
          />
        ))}
      </div>
    </main>
  )
}

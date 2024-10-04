'use client'
import { uploadImage } from '@/lib/firebase'
import Link from 'next/link'
import { type FormEvent, useState } from 'react'

export default function Home() {
  const [imageUrl, setImageUrl] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const image = new FormData(event.currentTarget).get('image')

    if (!image || !(image instanceof File)) return
    const url = await uploadImage(image)

    setImageUrl(url)
  }

  return (
    <main className="flex h-screen w-full flex-col items-center gap-4 p-28">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Upload Image</h1>
        <input type="file" name="image" accept="image/*" />
        <button
          className="rounded-md bg-zinc-300 px-2 py-1 text-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-100 disabled:opacity-50"
          type="submit"
        >
          Upload
        </button>

        {imageUrl && (
          <img className="size-16 rounded-md" src={imageUrl} alt="uploaded" />
        )}
      </form>

      <Link href="/gallery">Galeria de Imagens</Link>
    </main>
  )
}

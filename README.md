# Firebase Image Upload with Next.js

Este projeto é uma aplicação web simples criada com Next.js para fazer upload de imagens para o Firebase Storage. Ele inclui duas páginas: uma para fazer o upload das imagens e outra para exibir uma galeria das imagens salvas.

## Tecnologias utilizadas
- [Next.js](https://nextjs.org/)
- [Firebase Storage](https://firebase.google.com/products/storage)
- [pnpm](https://pnpm.io/) como gerenciador de pacotes

## Funcionalidades

- **Upload de Imagens:** Na rota `/`, os usuários podem selecionar e fazer o upload de uma imagem, com um pequeno preview exibido logo após o envio.
- **Galeria de Imagens:** Na rota `/gallery`, os usuários podem visualizar todas as imagens que foram enviadas anteriormente, obtidas diretamente do Firebase Storage.

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone <URL-do-repo>
   cd <nome-do-projeto>
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Crie um projeto no Firebase:**
   - Acesse [Firebase Console](https://console.firebase.google.com/).
   - Crie um novo projeto.
   - Adicione uma nova aplicação web e copie as chaves de acesso fornecidas.

4. **Crie um arquivo `.env` na raiz do projeto com as chaves do Firebase:**
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=<sua-api-key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<seu-auth-domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<seu-project-id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<seu-storage-bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<seu-messaging-sender-id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<seu-app-id>
   ```

5. **Rode a aplicação em modo de desenvolvimento:**
   ```bash
   pnpm dev
   ```

6. **Acesse a aplicação em:**
   ```
   http://localhost:3000
   ```

## Estrutura do projeto

A aplicação foi dividida em duas rotas principais:

### 1. Rota `/` - Página de Upload
Na página inicial, você encontrará um formulário com um input do tipo file para selecionar uma imagem e um botão "Upload" para enviá-la ao Firebase. Após o upload, a imagem será exibida como preview.

#### Código:

```ts
'use client'
import { uploadImage } from '@/lib/firebase'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'

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
          <img
            className='size-16 rounded-md'
            src={imageUrl}
            alt="uploaded"
          />
        )}
      </form>

      <Link href="/gallery">Galeria de Imagens</Link>
    </main>
  )
}
```

Neste arquivo, a função `handleSubmit` coleta o arquivo de imagem e utiliza a função `uploadImage` (definida em `src/lib/firebase.ts`) para enviá-la ao Firebase Storage. Após o upload, a URL da imagem é armazenada no estado e um preview é exibido.

### 2. Rota `/gallery` - Página de Galeria

Nesta rota, todas as imagens enviadas anteriormente são listadas e exibidas. A função `getImagesPath`, também definida no arquivo `firebase.ts`, busca todas as URLs das imagens salvas no Firebase Storage e as exibe em uma galeria.

#### Código:

```ts
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
            alt='uploaded'
          />
        ))}
      </div>
    </main>
  )
}
```

### Firebase SDK

O arquivo `src/lib/firebase.ts` contém a configuração do Firebase e funções para lidar com upload e obtenção de imagens do Firebase Storage.

#### Código:

```ts
import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)

export async function uploadImage(file: File): Promise<string> {
  const fileName = file.name

  const storageRef = ref(storage, `images/${fileName}`)
  const result = await uploadBytes(storageRef, file)

  const url = await getDownloadURL(result.ref)

  return url
}

export async function getImagesPath(path = 'images/') {
  const storageRef = ref(storage, path)

  const list = await listAll(storageRef)

  const urls = await Promise.all(list.items.map(item => getDownloadURL(item)))

  return urls
}
```

#### Explicação:
- `initializeApp`: Inicializa o Firebase com as configurações fornecidas.
- `getStorage`: Obtém a instância do serviço de armazenamento do Firebase.
- `uploadImage`: Faz o upload de uma imagem para o Firebase Storage e retorna a URL de download.
- `getImagesPath`: Busca todas as imagens armazenadas no caminho especificado e retorna as URLs.
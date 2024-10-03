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

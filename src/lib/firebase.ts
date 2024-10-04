import { initializeApp } from 'firebase/app'
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCgrbdqwIuTwfB5gFtFwPSzUAE5vt8rnDU',
  authDomain: 'save-image-a99a7.firebaseapp.com',
  projectId: 'save-image-a99a7',
  storageBucket: 'save-image-a99a7.appspot.com',
  messagingSenderId: '1036820627147',
  appId: '1:1036820627147:web:d322a3d24dee4d5255654e',
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export async function uploadImage(file: File) {
  const fileName = file.name

  const storageRef = ref(storage, `images/${fileName}`)
  const result = await uploadBytes(storageRef, file)

  const url = await getDownloadURL(result.ref)

  return url
}

export async function getImagesPath(path = 'images/') {
  const storageRef = ref(storage, path)
  const listImages = await listAll(storageRef)

  const urls = await Promise.all(
    listImages.items.map(item => getDownloadURL(item))
  )

  return urls
}

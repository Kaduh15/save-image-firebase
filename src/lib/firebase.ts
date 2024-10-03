import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDhqKPgjemfAXfEUXUa6Q_ShsEqQVvaCgk',
  authDomain: 'save-image-5073a.firebaseapp.com',
  projectId: 'save-image-5073a',
  storageBucket: 'save-image-5073a.appspot.com',
  messagingSenderId: '89398883415',
  appId: '1:89398883415:web:c4dce78cb2b2c083f11f12',
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
  const storageRef = ref(storage,path)

  const list = await listAll(storageRef)

  const urls =await  Promise.all(list.items.map((item) => getDownloadURL(item)))

  return urls
}

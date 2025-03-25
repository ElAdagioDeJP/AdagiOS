
const DB_NAME = 'movil';
// KEY FOR INDEXEDDB for images
export const KEY_IMAGES = 'images';
export const CONTACTS = 'contacts';
export const RECORDER = 'recorder';

export interface Contact {
    name: string,
    number: string,
}

interface RecorderItem{
    time:number,
    id:string,
    duration:number,
    blob:Blob
}


export interface Image {
    image: string
    id: number
}

function openDB() {
    const rq = indexedDB.open(DB_NAME, 1)

    rq.onupgradeneeded = () => {
        const db = rq.result
        db.createObjectStore(KEY_IMAGES, { keyPath: 'id', autoIncrement: true })
        db.createObjectStore(CONTACTS, { keyPath: 'id', autoIncrement: true })
        db.createObjectStore(RECORDER, { keyPath: 'id', autoIncrement: true })

    }
    return rq
}


export function  saveImage(image: string) {
    const db = openDB()

        db.onsuccess = () => {
        const tx = db.result.transaction(KEY_IMAGES, 'readwrite')
        const store = tx.objectStore(KEY_IMAGES)
        store.add({ image })
        }
}

export function saveContact(contact: Contact) {
    const db = openDB()

    db.onsuccess = () => {
        const tx = db.result.transaction(CONTACTS, 'readwrite')
        const store = tx.objectStore(CONTACTS)
        store.add({contact})
    }
}

export function saveRecorderItem(item: RecorderItem) {
    const db = openDB()

    db.onsuccess = () => {
        const tx = db.result.transaction(RECORDER, 'readwrite')
        const store = tx.objectStore(RECORDER)
        store.add(item)
    }
}

export  function getImages(): Promise<Image[]> {
    return new Promise((resolve) => {
        const db = openDB()
            db.onsuccess = () => {
                const tx = db.result.transaction(KEY_IMAGES, 'readonly')
                const store = tx.objectStore(KEY_IMAGES)
                const rq = store.getAll()
                rq.onsuccess = () => {
                    resolve(rq.result)
                }
            }
    })
}

export function getContacts(): Promise<Contact[]> {
    return new Promise((resolve) => {
        const db = openDB()

        db.onsuccess = () => {
            const tx = db.result.transaction(CONTACTS, 'readonly')
            const store = tx.objectStore(CONTACTS)
            const rq = store.getAll()
            rq.onsuccess = () => {
                resolve(rq.result.map((item: {contact: Contact}) => item.contact))
            }
        }
    })
}


export function getRecorderItems(): Promise<RecorderItem[]> {
    return new Promise((resolve) => {
        const db = openDB()

        db.onsuccess = () => {
            const tx = db.result.transaction(RECORDER, 'readonly')
            const store = tx.objectStore(RECORDER)
            const rq = store.getAll()
            rq.onsuccess = () => {
                resolve(rq.result)
            }
        }
    })
}

export function deleteImage(id: number) {
    const db = openDB()

    db.onsuccess = () => {
        const tx = db.result.transaction(KEY_IMAGES, 'readwrite')
        const store = tx.objectStore(KEY_IMAGES)
        store.delete(id)
    }
}

export function deleteRecorderItem(id:string) {
    const db = openDB()

    db.onsuccess = () => {
        const tx = db.result.transaction(RECORDER, 'readwrite')
        const store = tx.objectStore(RECORDER)
        store.delete(id)
    }
}
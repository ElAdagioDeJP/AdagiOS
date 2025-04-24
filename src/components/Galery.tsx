import { useEffect, useMemo, useState,memo, useCallback } from "react"
import { Trash,CircleCheckBig } from "lucide-react"
import { useLongPress } from "use-long-press"
import { deleteImage, getImages,Image, saveImage } from "@/services/indexdb"


const MemoImageVisor = memo(ImageViewer)
const MemoImageItem = memo(ImageItem)

function Galery() {
    const [images, setImages] = useState<Image[]>([])
    const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
    const [currentImage, setCurrentImage] = useState<number|null>(null)
    const bind = useLongPress((_,meta)=>{
      if (!selectedImages.has(meta.context as number)){
      setSelectedImages((prev)=>new Set([...prev,meta.context as number]))
      }
    },{
      onCancel:(_,meta)=>{
        if (selectedImages.has(meta.context as number)){
        setSelectedImages((prev)=>new Set([...prev].filter((id)=>id !== meta.context))
        )
        }else{
          setTimeout(()=>{
            setCurrentImage(meta.context as number)
          })
        }
      }
    })

    useEffect(()=>{
      async function updateImages(){
        const images = getImages()
        if (images){
          const data = await images
          setImages((prev)=>{
            return [...prev,...data]
          })
        }
      }

      updateImages()

    },[])





      const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const files = event.dataTransfer.files
        const images = Array.from(files).filter((file) => file.type.startsWith("image/"))
        images.forEach((image) => {
          const reader = new FileReader()
          reader.onload = (event) => {
        const data = event.target?.result
        if (typeof data === "string") {
          saveImage(data)
          setImages((prev) => [...prev, { image: data, id: Date.now() }])
        }
          }
          reader.readAsDataURL(image)
        })
      }, [])


      const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
      }
      , [])


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const CurrentSrc = useMemo(()=> images.find((image)=>image.id === currentImage)?.image,[currentImage])

    
    


    return (
      <main className="w-full p-2 h-full overflow-auto  bg-white" onDrop={onDrop} 
      onDragOver={onDragOver}
      >
        { 
        currentImage !== null
         && 
          <MemoImageVisor src={CurrentSrc as string} setCurrentImage={setCurrentImage} currentImage={currentImage} />
        }


        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,261.578px))] gap-2">
          {
            images.map((image) => (
              <MemoImageItem
                image={image}
                selected={selectedImages.has(image.id)}
                bind={bind}
                key={image.id}
              />
            ))

          }
  

        </div>
        {
          selectedImages.size > 0 && (
            <div className="fixed bottom-8 left-0 right-0 bg-gray-900 p-2 flex justify-between items-center">
              <p className="text-white">{selectedImages.size} selected</p>
              <button
                onClick={() => {
                  
                  selectedImages.forEach((image) => {
                    deleteImage(image)
                  }
                  )

                  setImages((prev) => prev.filter((image) => !selectedImages.has(image.id)))
                  setSelectedImages(new Set())
                }}
                className="text-white"
              >
                <Trash size={24} />
              </button>
            </div>
          )
        }
      </main>
    )
}



interface ImageViewerProps {
  src: string
  currentImage: number | null
  setCurrentImage: (index: number | null) => void
}




function ImageViewer({src, setCurrentImage, currentImage}: ImageViewerProps){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <img
    src={src}
    alt={`Photo ${currentImage && currentImage + 1}`} 
    className="object-cover aspect-[9/16] "
    onClick={() => setCurrentImage(null)}
 />
 </div>
  )
}


interface ImageItemProps {
  image: Image
  selected: boolean,
  bind: ReturnType<typeof useLongPress>
}






function ImageItem ({image, selected, bind}: ImageItemProps){
  return (
    <div className="relative aspect-square w-full" key={image.id}
    {...bind(image.id)}     
    >
      <img
        draggable="false"
        src={image.image}
        alt={`Photo ${image.id + 1}`}
        className={`w-full pointer-events-none object-contain aspect-square`}
        loading="lazy"
      />

      {
        selected && (
          <div className="absolute bottom-2 right-2">
            <CircleCheckBig size={24} color="#146eff" />
          </div>
        )
      }

    </div>
  )
}


export default memo(Galery)
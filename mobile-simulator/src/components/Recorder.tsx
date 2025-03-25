import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {Play,Trash,Check,Pause} from "lucide-react"
import { deleteRecorderItem, getRecorderItems, saveRecorderItem } from "@/services/indexdb"
interface RecorderItem{
  time:number,
  id:string,
  duration:number,
  blobUrl:string
}


const formatTime = (time:number):string=>{
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = Math.floor(time - (hours * 3600 + minutes * 60))
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}




function Recorder(){
  const [isRecording, setIsRecording] = useState(false)
  const [recorderList, setRecorderList] = useState<RecorderItem[]>([])
  const [seletedAudio,setSeletedAudio] = useState<string | null>(null)
  const [timeRecord, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRef = useRef<MediaRecorder|null>(null)
  const audio =  useRef<HTMLAudioElement | null>(null)
  const chunk = useRef<Blob[]>([])
  const initialTime = useRef<number>(0)


  useEffect(()=>{

    if(seletedAudio !== null){
      if(audio.current !== null){

        audio.current.src = recorderList.find((item)=>item.id === seletedAudio)?.blobUrl || ""
        audio.current.play()
        setIsPlaying(true)
      }else{
        audio.current = new Audio()
        audio.current.src = recorderList.find((item)=>item.id === seletedAudio)?.blobUrl || ""
        audio.current.play()
        setIsPlaying(true)
      }
    
    
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[seletedAudio])



  useEffect(()=>{
    async function getReconderList(){
      const list = await getRecorderItems()
      const newList = list.map((item)=>{
        return {
          ...item,
          blobUrl:URL.createObjectURL(item.blob)
        }
      })
      setRecorderList(newList)
    }

    getReconderList()
  },[])

  useEffect(()=>{

    if(isRecording){
      const interval = setInterval(()=>{
        setTime(prev=>prev+1)
      },1000)
      initialTime.current = Date.now()

      chunk.current = []

      navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
         mediaRef.current = new MediaRecorder(stream)
         if(mediaRef.current !== null){

        mediaRef.current.ondataavailable = (e)=>{
          chunk.current.push(e.data)
        }

        mediaRef.current.onstop = ()=>{
          stream.getTracks().forEach((track)=>{
            track.stop()
          })
          const blob = new Blob(chunk.current,{type:"audio/wav"})
          // const duration = Date.now() - initialTime.current

          const newAudio = new Audio(URL.createObjectURL(blob))
          newAudio.ondurationchange = ()=>{
            const duration = newAudio.duration
            if (isFinite(duration)){

          const id = Math.random().toString(36).substring(7)
          const newItem = {
            time: initialTime.current,
            id,
            duration,
            blobUrl: URL.createObjectURL(blob)
          }
          setRecorderList((prev) => [...prev, newItem])
          saveRecorderItem({
            id,
            duration,
            blob,
            time: initialTime.current
          })
            
          newAudio.remove()
          
            }

          }
          newAudio.load()
          newAudio.currentTime = 24 * 60 * 60
          newAudio.volume = 0
          newAudio.play()

        }

        mediaRef.current.start()

    }
      })

      return ()=>clearInterval(interval)
    }else{
      setTime(0)
    }
  },[isRecording])


  const handleDelete = useCallback( (id:string) => {
    deleteRecorderItem(id)
    setRecorderList((prev)=>prev.filter((item)=>item.id !== id))
  },[])




  const handleToggle = useCallback(()=>{
    if(isPlaying){
      audio.current?.pause()
      setIsPlaying(false)
    }else{
      audio.current?.play()
      setIsPlaying(true)
    }
  }
  ,[isPlaying])


  const handleToggleRecording = useCallback(()=>{
    mediaRef.current?.stop()
    setIsRecording((prev)=>!prev)
  } ,[])

  const seletedA = useCallback((id:string)=>{
    setSeletedAudio(id)
  },[])




return (<section className={`w-full h-full relative bg-[#111] overflow-x-auto ${isRecording ? "flex flex-col justify-center items-center" : ""} `}>
  {isRecording ? <TimeIndicator time={timeRecord}/> : 
   <ul className="flex flex-col gap-4 p-4">
   {recorderList.map((item,index)=>(
     <RecorderItem key={index} time={item.time} id={item.id} seleted={seletedAudio === item.id}
     duration={item.duration}
     audio={audio.current}
     isPlaying={isPlaying}
     setIem={seletedA}
     setPause={handleToggle}
     handleDelete={handleDelete}
      />
    ))}
  </ul>
  }




  <button 
  onClick={handleToggleRecording}
  className="rounded-full bg-red-500 w-12 h-12 flex justify-center items-center active:scale-75 transition-transform fixed bottom-20 left-0 right-0 m-auto">
   { 
    !isRecording ?
    <div className=" rounded-full bg-white w-4 h-4 "></div>:
    <Check color="white"/>
  
   }
  </button>



</section>)
}



function TimeIndicator({time}:{time:number}){
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <span className="text-white text-4xl">{formatTime(time)}</span>
    </div>
  )
}










interface RecorderItemProps {
  time:number,
  id:string,
  seleted:boolean,
  setIem : (itemId:string)=>void
  isPlaying:boolean
  setPause:()=>void
  audio : HTMLAudioElement | null,
  duration:number,
  handleDelete:(id:string)=>void
}

// use intl format to short day and month
const format  = new Intl.DateTimeFormat('default', { day: '2-digit', month: 'short' })

// element of the list of the recorder
function  RecorderItem({id,seleted,setIem,isPlaying,setPause,audio,duration,handleDelete,time}:RecorderItemProps){
    const [currentTime,setCurrentTime] = useState(0)

    useEffect(()=>{
      if(audio !== null && seleted){
        audio.addEventListener('timeupdate',()=>{
          setCurrentTime((audio.currentTime))
        })
      }
    },[audio,seleted])

    const witdh = useMemo(()=>{
      return currentTime / duration
    },[currentTime,duration])

    const seletedA = useCallback(()=>{
      setIem(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } ,[])

    const Delete = useCallback(()=>{
      handleDelete(id)
    } , [handleDelete,id])


    const handlePause = useCallback(()=>{
      if(audio !== null){
        audio.pause()
        setPause()
      }
    }
    ,[audio,setPause])

    const durationFormat = useMemo(()=>{
      return duration ? formatTime(duration) : "00:00:00"
    }
    ,[duration])

    const currentTimeFormat = useMemo(()=>{
      return formatTime(Math.floor(currentTime))
    }
    ,[currentTime])


  return (
    <li className="flex  flex-col gap-4  text-white p-6 bg-neutral-800 rounded-xl"
    onClick={seletedA}
    >

      <div className="flex flex-row items-center gap-4">
        <div className="bg-zinc-700  p-3 rounded-full"
        onClick={handlePause}
        >
        
        {  
        !isPlaying || !seleted ?       
          <Play className="w-4 h-4 bg-zin-300" strokeWidth={3} fill="#6a6a73" color="#6a6a73"/>:
          <Pause className="w-4 h-4 bg-zin-300" strokeWidth={3} fill="#6a6a73" color="#6a6a73"/>
    }
        </div>
        <div className="flex flex-col w-full">

          <div className="flex gap-4">
            <span className="font-bold text-xl">{id}</span>
            <p className="font-bold text-xl">{format.format(time)}</p>
            <button className="ml-auto"
            onClick={Delete}
            >
            <Trash />
            </button>
          </div>
          <span className="text-neutral-400 text-sm">
            
            { seleted ? <span className="text-green-400">{currentTimeFormat}</span> : null} /
            <span className="text-green-400">/{durationFormat}</span> </span>
        </div>

    {/* bar progress red */}

      </div>

      { seleted && <div className="w-full h-1 bg-stone-600 rounded-full">
        <div>
          <div className="h-1 bg-red-500 rounded-full relative transition-all"
          style={{width:`${witdh * 100}%`}}  
        >
            {/* indicator where is the video with a circle */}
            <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0 -mt-1 left-full"
            />
          </div>
        </div>
      
      </div>}

    </li>
  )
}


export default memo(Recorder)
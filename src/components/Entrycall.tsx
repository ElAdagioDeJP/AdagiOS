import { Phone, X } from 'lucide-react'
import xd from "@/assets/xd.mp3"
import { motion, AnimatePresence } from "framer-motion"
import useMovilStore from '@stores/movil'
import { useCallback } from 'react'


interface EntryCallProps {
  IdFrom : string
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}


export default function EntryCall({IdFrom, isVisible, setIsVisible}: EntryCallProps) {
  const setCurrentPage = useMovilStore((state) => state.changePage)
  const socket = useMovilStore((state) => state.socket)
  const setidFrom =  useMovilStore((state)=> state.setEntryCallId)

  const handleAnswer = useCallback(() => {
    setIsVisible(false)
    socket?.emit("acceptCall",{targetId:IdFrom})
    setidFrom(Number(IdFrom))
    setCurrentPage("Telefono")
  },[IdFrom,setCurrentPage,setidFrom,setIsVisible,socket])

  const handleReject = useCallback(() => {
    console.log('rejectCall event client send');
    socket?.emit('rejectCall',{targetId:IdFrom})
    setIsVisible(false)
  },[IdFrom,setIsVisible,socket])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: -100, opacity: 0 }} 
          transition={{ duration: 0.5 }}
          className="fixed top-4 left-0 right-0 p-4 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Llamada entrante</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{IdFrom}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <audio src={xd} autoPlay loop />
                  <button 
                    onClick={handleReject}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleAnswer}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


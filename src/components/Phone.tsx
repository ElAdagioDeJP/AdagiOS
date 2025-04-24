import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Phone, PhoneOff, Volume2, Keyboard, Users, UserPlus} from 'lucide-react'
import Dial from '../assets/dial.wav'
import tono from '@/assets/tono.mp3'
import Dialog from './Dialog.tsx'
import {saveContact, getContacts, Contact} from "@/services/indexdb"
import useMovilStore from '@stores/movil.ts'
import SimplePeer from 'simple-peer'



const Component = () => {
  const setIdfrom = useMovilStore((state) => state.setEntryCallId)
  const idFrom = useMovilStore((state)=> state.EntryCallId)

  const [number, setNumber] = useState( idFrom?.toString() || '')
  const [inCall, setInCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [validated, setValidated] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContactName, setNewContactName] = useState('')
  const contactsRef = useRef<HTMLDialogElement>(null);
  const addContactRef = useRef<HTMLDialogElement>(null);

  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const localAudioRef = useRef<HTMLAudioElement>(null)
  // const [peer, setPeer] = useState<SimplePeer.Instance | null>(null)
  const peer = useRef<SimplePeer.Instance | null>(null)

  const tonoAudio = useRef(new Audio(tono))

  const socket = useMovilStore((state) => state.socket)


  const handleRejectCall = useCallback(() => {
    console.log('rejectCall event');
    setInCall(false);
    setValidated(false);
    setCallDuration(0);
    setIdfrom(null);
    peer.current?.destroy();
    peer.current = null;
    tonoAudio.current.pause()
  }, [setIdfrom]);

  const handleCancelCall = useCallback(() => {
    console.log('CancelCall event');
    setInCall(false);
    setValidated(false);
    setIdfrom(null);
    setCallDuration(0);
    peer.current?.destroy();
    peer.current = null;
  }, [setIdfrom]);

  const handleAcceptCall = useCallback(async () => {
    // desactivar sonido de tono
    tonoAudio.current.pause()
    setValidated(true);
  }, []);

  const handleSignal = useCallback(({ signal }:{signal:string}) => {
    console.log("socket signal event");
    if (peer.current) {
      console.log('signal event');
      peer.current.signal(signal);
    }
  }, []);

  const createPeer = useCallback(async (number: string, initiator: boolean) => {
    if (!localAudioRef.current){
      console.error('localAudioRef.current is null')
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!stream) {
      console.error('stream is null')
      return
    }

    const newPeer = new SimplePeer({
      stream: stream,
      initiator: initiator,
      trickle: true,
    });

    newPeer.on("signal", (signal) => {
      socket?.emit("signal", { targetId: number, signal });
    });

    newPeer.on("connect", () => {
      console.log('Peer connected');
      setValidated(true);
    });

    newPeer.on("stream", (stream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
      } else {
        console.error('remoteAudioRef.current is null')
      }
    });

    newPeer.on("error", () => {
      console.log('Peer closed');
    });
    if(socket){
      socket.off('signal', handleSignal);
      socket.on('signal', handleSignal);
    }
     peer.current = newPeer;
  }, [socket]);

  const handleSocketEvents = useCallback(() => {
    if (socket) {
      console.log("creando eventos de socket")
      socket.on('rejectCall', handleRejectCall);
      socket.on("CancelCall", handleCancelCall);
      socket.on("acceptCall", handleAcceptCall);

      return () => {
        socket.off('rejectCall', handleRejectCall);
        socket.off('CancelCall', handleCancelCall);
        socket.off('acceptCall', handleAcceptCall);
        socket.off('signal', handleSignal);
        peer.current?.destroy();
      }
    }
  }, [socket, peer, handleRejectCall, handleCancelCall, handleAcceptCall, handleSignal]);



  useEffect(() => {
    if (idFrom !== null && !peer.current ) {
      setNumber(idFrom.toString());
      const initiatePeer = async () => {
        console.log("creating peer from idFrom");
        await createPeer(idFrom.toString(), true);
        setValidated(true);
        setInCall(true);
      }
      initiatePeer();
    }
  }, [idFrom, createPeer]);

  useEffect(() => {
    handleSocketEvents();
  }, [handleSocketEvents]);

  useEffect(() => {
    setAudio(new Audio(Dial));
  }, []);

  const playDialSound = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio]);

  const addDigit = useCallback((digit: string) => {
    setNumber(prev => (prev + digit).slice(-20));
    playDialSound();
  }, [playDialSound]);

  const deleteDigit = useCallback(() => {
    setNumber(prev => prev.slice(0, -1));
  }, []);

  const startCall = useCallback(async () => {
    if (number.length > 0) {
      if (number === null) return;
      console.log("creating peer");
      await createPeer(number.toString(), false);
      setInCall(true);
      tonoAudio.current.currentTime = 0
      tonoAudio.current.play()
      socket?.emit('call', { targetId: number });
    }
  }, [createPeer, number, socket]);

  const endCall = useCallback(() => {
    setInCall(false);
    setValidated(false);
    setCallDuration(0);
    peer.current?.destroy();
    peer.current = null;
    setIdfrom(null);
    tonoAudio.current.pause()
    socket?.emit('CancelCall', { targetId: number });
  }, [setIdfrom, socket, number]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inCall && validated) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inCall, validated]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const dialPad = useMemo(() => [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ], []);


const handleShowModalContacs = useCallback(() => {
  contactsRef.current?.showModal();
} ,[contactsRef])

const handleShowModalAdd = useCallback(() => {
  addContactRef.current?.showModal();
},
[addContactRef])


const handleHideModalContatcs = useCallback(() => {
  contactsRef.current?.close();
}
,[contactsRef])

const handleHideModalAdd = useCallback(() => {
  addContactRef.current?.close();
}
,[addContactRef])

const handleAddContact = useCallback( async () => {
   saveContact({name: newContactName, number: number})
   handleHideModalAdd()
}
,[newContactName,number,handleHideModalAdd])

const handleAddDigit = useCallback((digit: string) => {
  addDigit(digit)
}
,[addDigit])





  if (inCall) {
    return (
      <div className="flex flex-col items-center justify-between h-full bg-gray-100 p-6">
        <audio ref={remoteAudioRef} autoPlay />
        <audio ref={localAudioRef} autoPlay muted />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{number}</h2>
          <p className="text-lg">
            {validated ? `${formatDuration(callDuration)}` : 'Calling...'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          <Button variant="ghost" size="lg" className="aspect-square">
            <Mic className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="lg" className="aspect-square">
            <Keyboard className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="lg" className="aspect-square">
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>
        <Button 
          variant="destructive" 
          size="lg" 
          className="rounded-full aspect-square"
          onClick={endCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between h-full bg-gray-100 p-6">
      <audio ref={remoteAudioRef} autoPlay />
      <audio ref={localAudioRef} autoPlay muted />
      <div className="text-4xl font-light mb-6 h-12 overflow-hidden">
        {number}
      </div>
      {(number.length > 0) ? 
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={handleShowModalAdd}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir Contacto
        </Button>  : ''
      }

      <Dialog someRef={addContactRef}>
        <div className='flex justify-between'>
          <p className='font-bold'> Nuevo contacto </p>
          <button onClick={handleHideModalAdd}>
            <p className='font-light text-sm' > x </p>
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="Contact Name"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
          />
          <div>Número: {number}</div>
          <Button onClick={handleAddContact}>Añadir Contacto</Button>
        </div>
      </Dialog>
      
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {dialPad.map((row) => (
          row.map((digit) => (
            <Button
              key={digit}
              variant="ghost"
              size="lg"
              className="aspect-square text-2xl font-light"
              onClick={() => handleAddDigit(digit)}
            >
              {digit}
            </Button>
          ))
        ))}
        <Button
          variant="ghost"
          size="lg"
          className="aspect-square text-lg font-light"
          onClick={deleteDigit}
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="aspect-square bg-green-500 hover:bg-green-600 text-white rounded-full"
          onClick={startCall}
        >
          <Phone className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="aspect-square" onClick={async () => {
          handleShowModalContacs()
          setContacts(await getContacts())
          console.log(contacts)
        }}>
          <Users className="h-6 w-6" />
        </Button>
        <Dialog someRef={contactsRef}>
          <div className='flex justify-between min-w-40'>
            <p className='font-bold'> Contactos </p>
            <button onClick={handleHideModalContatcs}>
              <p className='font-light text-sm' > x </p>
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {contacts.map((contact, index) => (
              <div key={index} className="flex justify-between items-center" onClick={() => {
                setNumber(contact.number)
                startCall()
                handleHideModalContatcs()
              }}>
                <span>{contact.name}</span>
                <span>{contact.number}</span>
              </div>
            ))}
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default memo(Component);
import { useRef, useEffect, useMemo, memo, useCallback } from 'react';
import Dialog from './Dialog';
import cellularIcon from '../assets/cellular.webp';
import noNetworkIcon from '../assets/noNetwork.webp';
import wifiIcon from '../assets/wifi.webp';
import useMovilStore from '@stores/movil';

// Appending the navigator.connection interface (Thanks TS!)
interface NavigatorNetworkInformation extends Navigator{
  readonly connection?: NetworkInformation
}

type Megabit = number
type Millisecond = number
type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g'

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: EffectiveConnectionType
  readonly downlink?: Megabit
  readonly rtt?: Millisecond
  readonly saveData?: boolean
  onchange?: EventListener
}

type NetworkType = 'wifi' | 'cellular';

const MemoDialog = memo(Dialog)


export default function Network() {
    const { networkStatus, setNetworkStatus } = useMovilStore()

    const ref = useRef<HTMLDialogElement>(null);

    // Network type is hardcoded for now, as the API ain't implemented in browsers yet
    const type: NetworkType = 'wifi';

    // If there's a connection, then show the appropriate icon
    const {icon,statusMsg} = useMemo(()=>{
    if (networkStatus === 'connected') {
        if (type === 'wifi') {
            return {icon:wifiIcon,statusMsg:'Conectado a la red Wi-Fi'}
        } else {
            const effectiveType = (navigator as NavigatorNetworkInformation).connection?.effectiveType ?? ''
            return {icon:cellularIcon,statusMsg:`Conectado a la red celular (${effectiveType})`}
        }
    } else {
        return {icon:noNetworkIcon,statusMsg:'Sin conexión a la red'}
    }
    }
    ,[networkStatus,type])

    // figure out the network status
    useEffect(() => {
        const connection = (navigator as NavigatorNetworkInformation).connection
        const updateNetworkStatus = () => {
            console.log("Network status updated")
            if (navigator.onLine) {
                setNetworkStatus('connected')
            } else {
                setNetworkStatus('disconnected')
            }
        }

        if (connection){
            window.addEventListener('online', updateNetworkStatus)
            window.addEventListener('offline', updateNetworkStatus)
            updateNetworkStatus()
        }else{
            const interval = setInterval(updateNetworkStatus, 1000)
            return () => clearInterval(interval)
        }

        return () => {
            if(connection){
            window.removeEventListener('online', updateNetworkStatus)
            window.removeEventListener('offline', updateNetworkStatus)
            }
        }

    }, [setNetworkStatus])

    
    const OpenModal =  useCallback(() => {
        ref.current?.showModal();
    }
    ,[ref])

    const CloseModal = useCallback(() => {
        ref.current?.close();
    } ,[ref])




    return (
        <>
            <button onClick={OpenModal}>
                <img src={icon} width='20' alt='Network'/>
            </button>
            <MemoDialog someRef={ref}
                onClick={CloseModal}
            >
                <p>{statusMsg}</p>
            </MemoDialog>
        </>
    )
}
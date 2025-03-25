import { useRef } from 'react';
import useMovilStore from '@stores/movil';
import powerIcon from '../assets/power.webp';
import whitePowerIcon from '../assets/whitePower.svg';
import Dialog from './Dialog';
import Button from './Button';

export default function Power() {
    const ref = useRef<HTMLDialogElement>(null);
    const  power = useMovilStore(state => state.power)
    const setPower = useMovilStore(state => state.setPower)

    if (!power) {
        return (
            <button onClick={() => setPower(true)}>
                <img src={whitePowerIcon} width='20' alt='Power'/>
            </button>
        )
    }

    return (
        <>
            <button onClick={() => {
                ref.current?.showModal();
            }}>
                <img src={powerIcon} width='20' alt='Power'/>
            </button>
            <Dialog someRef={ref}>
                <p> ¿Desea apagar el dispositivo? </p>
                <div>
                    <Button onClick={() => ref.current?.close()}
                        className='bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-500'
                    >
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                            ref.current?.close()
                            setPower(false)
                        }}
                        className='bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500'
                    >
                        Apagar
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

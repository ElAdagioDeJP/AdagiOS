import { useRef } from 'react';
import useMovilStore from '@stores/movil';
import powerIcon from '../assets/power.webp';
import whitePowerIcon from '../assets/whitePower.svg';
import Dialog from './Dialog';
import Button from './Button';
import { X } from 'lucide-react';

export default function Power() {
  const ref = useRef<HTMLDialogElement>(null);
  const power = useMovilStore((state) => state.power);
  const setPower = useMovilStore((state) => state.setPower);

  if (!power) {
    return (
      <button onClick={() => setPower(true)}>
        <img src={whitePowerIcon} width="20" alt="Power" />
      </button>
    );
  }

  return (
    <>
      <button onClick={() => ref.current?.showModal()}>
        <img src={powerIcon} width="20" alt="Power" />
      </button>
      <Dialog someRef={ref}>
        <div className="flex flex-col items-center p-6">
          {/* Ícono central grande (opcional) para simular la interfaz de apagado */}
          <div className="mb-4">
            <img src={powerIcon} width="60" alt="Power Off" />
          </div>
          <div className="flex space-x-4">
            {/* Botón de cancelar con ícono X */}
            <Button
              onClick={() => ref.current?.close()}
              className="bg-gray-200 border-gray-400 hover:bg-gray-300 rounded-full p-3"
            >
              <X size={24} className="text-gray-700" />
            </Button>
            {/* Botón de apagar con el ícono de apagado */}
            <Button
              onClick={() => {
                ref.current?.close();
                setPower(false);
              }}
              className="bg-red-500 border-red-700 hover:bg-red-600 rounded-full p-3"
            >
              <img src={powerIcon} width="24" alt="Apagar" />
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

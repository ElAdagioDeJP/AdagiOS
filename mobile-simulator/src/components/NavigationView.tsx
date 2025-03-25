import useMovilStore from "@stores/movil";
import {X} from "lucide-react";
import { memo } from "react";

function NavigationView() {
  const process = useMovilStore((state) => state.process)
  const removeProcess = useMovilStore((state) => state.removeProcess)
  const changePage = useMovilStore((state) => state.changePage)

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm p-2">
      <div className="flex flex-wrap justify-center  gap-8">
        {process.map((p) => {
          return (
            <div 
            key={p.name} className="flex justify-center items-center relative gap-4">
              <X size={20} color="#e51d1d" className="absolute -top-5 -right-3 m-1 cursor-pointer"
              onClick={() => removeProcess(p)}
              />
              <img src={p.urlIcon} alt={p.name} className="w-12 cursor-pointer"
            onClick={() => changePage(p.name)}

            />
            <span className="text-white">
            {p.name}

            </span>
            </div>
          )
        })}
      </div>
    </div>
  )






}

export default memo(NavigationView)
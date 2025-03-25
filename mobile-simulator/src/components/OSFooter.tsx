import useMovilStore from '@stores/movil.ts'
import Home from './Home.tsx'
import {Square} from 'lucide-react'


export default function OSFooter () {
    const setCurrentPage = useMovilStore((state) => state.changePage)


    return (
        <footer className="bg-slate-50 flex items-center justify-center z-10 gap-3">
            <button onClick={() => setCurrentPage('Navigation')}>
            <Square size={20} className="m-1" />
            </button>

            <Home />
        </footer>
    )
}
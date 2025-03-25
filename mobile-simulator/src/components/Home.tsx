import homeIcon from '../assets/home.png';
import useMovilStore from '@stores/movil';

export default function Home() {
    const changePage = useMovilStore((state) => state.changePage);
    
    return (
        <button className='m-1' onClick={() => {changePage('home')}}>
            <img src={homeIcon} alt="Home" width='20' />
        </button>
    )
}
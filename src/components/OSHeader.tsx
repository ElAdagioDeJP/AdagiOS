import Battery from './Battery'
import Network from './Network'
import Power from './Power'
import Time from './Time'

export default function OSHeader() {

    return (
        <header className='bg-sky-200 w-screen flex justify-between px-2 z-10 bg'>
            {/* Time format comes from settings, not statically typed */}
            <Time />
            <p className='font-medium pointer-events-none'>AdagiOS</p>
            <div className='min-w-12 justify-between flex'>
                <Network />
                <Battery />
                <Power />
            </div>
            
        </header>
    )
}


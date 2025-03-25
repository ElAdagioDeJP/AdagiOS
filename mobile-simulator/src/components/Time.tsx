import { useState, useEffect } from 'react'

export default function Time() {
    const [time, setTime] = useState(new Date())
    const [format, setFormat] = useState('24h')

    const hours = format === '12h' && time.getHours() > 12 ? time.getHours() - 12 : time.getHours()
    const minutes = time.getMinutes().toString().padStart(2, '0')
    let appendix = ''

    if (format === '12h') {
        appendix = time.getHours() >= 12 ? 'PM' : 'AM'
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <button onClick={() => {setFormat(format === '24h' ? '12h' : '24h')}}>
            <p className='font-medium'>
                {hours}:{minutes} {appendix}
            </p>
        </button>
        
    )
}

import useMovilStore from "@stores/movil.ts"
import { useEffect, useRef, useState, CSSProperties, useMemo, memo, useCallback } from "react"
import { getRowAndColumn } from "@/utils"
import Galery from "@components/Galery"
import ProcessList from "@components/ProcessList"
import Camara from "@components/camara"
import { motion, AnimatePresence } from "framer-motion"
import Phone from "@components/Phone"
import Recorder from "@components/Recorder"
import Whatsapp from "@components/Whassapp"
import NavigationView from "./NavigationView"


const getSecondPage = (page: string): JSX.Element | null => {
    const PageComponents: { [key: string]: JSX.Element } = {
        "Navigation": <NavigationView />,
        "Chrome": <iframe src="https://www.google.com/webhp?igu=1" className="w-full h-full" />,
        "Netflix": <iframe src="https://fmovies2u.in/movies/" className="w-full h-full" />,
        "Spotify": <iframe src="https://honey-tyagi-spotify-clone.vercel.app/login/login.html" className="w-full h-full" />,
        "Amazon": <iframe src="https://www.mercadolibre.com.ve/" className="w-full h-full" />,
        "Youtube": <iframe src="https://www.dailymotion.com/co" className="w-full h-full" />,
        "Galeria": <Galery />,
        "Procesos": <ProcessList />,
        "Camara": <Camara />,
        "Telefono": <Phone />,
        "Recorder": <Recorder />,
        "Whatsapp": <Whatsapp />
    }
    return PageComponents[page] || null
}



const width = 90
const height = 114
const MemoHome = memo(Home)
const MemoBlock = memo(Block)
const MemoIconApp = memo(IconApp)



export default function Page() {
    const currentPage = useMovilStore((state) => state.currentPage)
    const IconCoordinates = useMovilStore((state) => state.IconAppCoordintes)
    const [isVisible, setIsVisible] = useState(false)


    useEffect(() => {

        if (currentPage !== "home") {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }


    }, [currentPage])


    const secondPage = useMemo(() => getSecondPage(currentPage), [currentPage])

    const x = IconCoordinates && typeof IconCoordinates.x === 'number' ? IconCoordinates.x : 0;
    const y = IconCoordinates && typeof IconCoordinates.y === 'number' ? IconCoordinates.y : 0;


    return (
        <div className="relative h-full">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        key="page"
                        initial={{ opacity: 0, scale: 0.5, x, y, width, height }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0, width: "100%", height: "100%" }}
                        exit={{ opacity: 0, scale: 0.5, x, y, width, height }}
                        transition={{ duration: 0.5 }}
                        className={`absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50`}
                    >
                        {secondPage}
                    </motion.div>
                )}
            </AnimatePresence>
            <MemoHome />
        </div>
    );
}


function Home() {
    const style: CSSProperties & { [key: string]: string } = {
        // "--bg-wallpaper": "url(https://img.asmedia.epimg.net/resizer/v2/NZTAJMVYTVHDJMOWYTEK3KKE6U.webp?auth=058fa8d2b79580189b58fd9d21735ad0c0d746352ae3bbc18185b915535e01c3&width=1472&height=1104&smart=true)"
    }

    return (
        <main id="home"
            style={style}
            className="flex w-full p-2 h-full bg-black">
            <MemoBlock />
        </main>

    )
}


interface App {
    name: string
    urlIcon: string
    column?: number
    row?: number
}
const APPs: App[] = [
    {
        name: "Whatsapp",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
    },
    {
        name: "Chrome",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732200.png"
    },
    {
        name: "Netflix",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/870/870910.png"
    },
    {
        name: "Spotify",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/174/174872.png"
    },
    {
        name: "Amazon",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732217.png"
    },
    {
        name: "Youtube",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
    },
    {
        "name": "Galeria",
        "urlIcon": "https://static.vecteezy.com/system/resources/previews/042/712/634/non_2x/google-gallery-icon-logo-symbol-free-png.png"
    },
    {
        name: "Procesos",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/10239/10239999.png"
    },
    {
        name: "Camara",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/1373/1373061.png"

    },
    {
        name: "Telefono",
        urlIcon: "https://cdn.iconscout.com/icon/free/png-256/free-apple-phone-icon-download-in-svg-png-gif-file-formats--logo-call-apps-pack-user-interface-icons-493154.png?f=webp&w=256"
    },
    {
        name: "Recorder",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/3817/3817556.png"
    }
]


function Block() {
    // localstorage for block position
    // const [apps, setApps] = useState<App[]>((localStorage.getItem("apps") && JSON.parse(localStorage.getItem("apps") as string)) || APPs)
    const [apps, setApps] = useState<App[]>(APPs)

    const [ElementDrag, setElementDrag] = useState<HTMLElement | null>(null)

    const setAppsPosition = useCallback((appName: string, row: number, column: number) => {
        setApps((apps) => {
            const newApps = [...apps];
            const existingAppIndex = newApps.findIndex(app => app.row === row && app.column === column);
            const movingAppIndex = newApps.findIndex(app => app.name === appName);

            if (existingAppIndex !== -1) {
                // Swap positions
                const tempRow = newApps[existingAppIndex].row;
                const tempColumn = newApps[existingAppIndex].column;
                newApps[existingAppIndex].row = newApps[movingAppIndex].row;
                newApps[existingAppIndex].column = newApps[movingAppIndex].column;
                newApps[movingAppIndex].row = tempRow;
                newApps[movingAppIndex].column = tempColumn;
            } else {
                // Update position
                newApps[movingAppIndex] = { ...newApps[movingAppIndex], row, column };
            }

            localStorage.setItem("apps", JSON.stringify(newApps));
            return newApps;
        });
    }, []);




    const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        setElementDrag(event.currentTarget)
    }, []);


    useEffect(() => {
        if (ElementDrag) {
            setTimeout(() => {
                ElementDrag.style.display = "none"
            })

            const handleDragEnd = (event: DragEvent) => {
                const { clientX: x, clientY: y } = event;
                const [row, column] = getRowAndColumn(x, y, 98);

                // Ensure the app is within the screen bounds
                const maxRow = Math.floor(window.innerHeight / 98);
                const maxColumn = Math.floor(window.innerWidth / 98);
                const boundedRow = Math.min(Math.max(row, 1), maxRow);
                const boundedColumn = Math.min(Math.max(column, 1), maxColumn);

                ElementDrag.style.display = "flex";
                setAppsPosition(ElementDrag.textContent as string, boundedRow, boundedColumn);
                setElementDrag(null);
            };

            ElementDrag.addEventListener("dragend", handleDragEnd);

            return () => {
                ElementDrag.removeEventListener("dragend", handleDragEnd);
            };


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ElementDrag])


    return <section className="grid grid-cols-[repeat(auto-fill,90px)] grid-rows-[repeat(auto-fill,90px)]  w-full gap-2 relative">
       

        {
            apps.map((app, index) => {
                return <MemoIconApp
                    setAppsPosition={setAppsPosition}
                    key={app.name} {...app} onDragStart={handleDragStart} index={index} />
            })

        }
    </section>
}


interface IconAppProps extends App {
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
    setAppsPosition: (appName: string, row: number, column: number) => void
    index?: number
}

function IconApp(props: IconAppProps) {
    const setPage = useMovilStore((state) => state.changePage)
    const setIconPosition = useMovilStore((state) => state.setIconAppCoordinates)
    const addProcess = useMovilStore((state) => state.addProcess)
    const { row, column } = props;
    const ref = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (column !== undefined || row !== undefined) return;
        const timeoutId = setTimeout(() => {
            if (ref.current) {
                // console.log("xd")
                const { x, y } = ref.current.getBoundingClientRect();
                const [newRow, newColumn] = getRowAndColumn(x, y, 98);
                props.setAppsPosition(props.name, newRow, newColumn);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [ref, column, row, props]);


    const style = column !== undefined && row !== undefined ? { gridColumnStart: `${column}`, gridRowStart: `${row}` } : {};

    const handleClick = useCallback(() => {
        if (ref.current) {
            const { x, y } = ref.current.getBoundingClientRect();
            setIconPosition(x, y)
        }
        addProcess({ name: props.name, urlIcon: props.urlIcon, component: () => null })
        setPage(props.name)
    }, [addProcess, props.name, props.urlIcon, setIconPosition, setPage])


    return <div
        ref={ref}
        onClick={handleClick}



        onDragStart={(event) => {
            //  console.log("drag", props.index)
            props.onDragStart(event)
        }
        } draggable="true"
        style={style}
        className={` w-[90px] aspect-square rounded flex flex-col items-center justify-center`}
    >
        <img src={props.urlIcon} alt={props.name} className="w-2/3  object-contain " />
        <p className="text-center text-white">{props.name}</p>
    </div>
}

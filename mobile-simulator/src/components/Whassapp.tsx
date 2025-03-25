import {Camera,Search,EllipsisVertical,MessageSquareTextIcon,MessageCircleDashed,Users2,Phone} from "lucide-react"
import avatar from "@/assets/avatar.png"
import { memo } from "react";


const Contacts = [
  {
    id:1,
    name:"Henry lang",
    lastMessage:`todo preparado`,
    avatar:"https://github.com/hl-2002.png"
  },
  {
    id:2,
    name:"Luis Hernandez",
    lastMessage:"Terminaste el proyecto?",
    avatar:"https://github.com/time9683.png"
  },
  {
    id:3,
    name:"Mario",
    lastMessage:"recuerda lo de SO",
    avatar
  }
]

function Whatsapp(){


    return (
      <section className="h-full w-full grid grid-rows-[auto_1fr_auto] bg-[#0c1317]">
       <header className="flex border-b border-zinc-700 p-4 justify-between">
          <h1 className="font-bold text-2xl text-white">WhatsApp</h1>

          <div className="flex gap-4">
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <Camera size={24} />
            </button>
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <Search size={24} />
            </button>
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <EllipsisVertical size={24} />
            </button>


          </div>

       </header>

        <ul className="overflow-x-auto">
            {
              Contacts.map((contact) => (
                <ContantItem key={contact.id} {...contact} />
              ))
            }


        </ul>

        <footer className="flex gap-4 p-4 justify-between">
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <MessageSquareTextIcon size={28} />
            </button>
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <MessageCircleDashed size={28} />
            </button>
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <Users2 size={28} />
            </button>
            <button className="flex items-center justify-center p-2 rounded-full  text-white">
              <Phone size={28} />
            </button>

        </footer>

      </section>
    );
  }

interface ContantItemProps {
  name: string;
  lastMessage: string;
  avatar: string;
}


function ContantItem({name, lastMessage, avatar}: ContantItemProps){

  return (
    <li className="flex items-center gap-4 p-4">
      <img src={avatar} alt="user" className="w-12 h-12 rounded-full" />
      <div>
        <h2 className="font-bold text-white">{name}</h2>
        <p className="text-gray-400">{lastMessage}</p>
      </div>
    </li>
  )
}

export default memo(Whatsapp)
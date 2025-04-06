import {Camera,Search,EllipsisVertical,MessageSquareTextIcon,MessageCircleDashed,Users2,Phone} from "lucide-react"
import avatar from "@/assets/avatar.jpg"
import { memo } from "react";


const Contacts = [
  {
    id:1,
    name:"Papi",
    lastMessage:`Buenos tardes hijo, que tengas un excelente dia en la universidad`,
    avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0cJSfgyNlZnmW3sotglnpcwjTnzqIHrCa8Q&s"
  },
  {
    id:2,
    name:"Cami ૮꒰ ˶• ༝ •˶꒱ა ❤",
    lastMessage:"Pudiste terminar el proyecto amor?",
    avatar:"https://i.ibb.co/qL419qmY/Cami.jpg"
  },
  {
    id:3,
    name:"Marco Polo UNI",
    lastMessage:"pero pa eso uno estudia",
    avatar
  },
  {
    id:4,
    name:"JUEGOS DE TIROS 2025 🐦‍⬛ SAQUENME DE VENEZUELA 💀",
    lastMessage:"JoseBM: Nicki Nicole, Si o No?",
    avatar:"https://i.pinimg.com/736x/40/36/66/403666f55e717fcbafb1369f49a5d896.jpg"
  },
  {
    id:5,
    name:"los churros🐀",
    lastMessage:"Albert: asjasjasjasj Literal",
    avatar:"https://agencia.fapesp.br/files/post/50883.jpg"
  },
  {
    id:6,
    name:"COMPRA VENTA",
    lastMessage:"Ani: Compro 150$ por Zelle",
    avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cdRHpb4YdtPwRcs6Z8eEb6qvp4LtfNUkdw&s"
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
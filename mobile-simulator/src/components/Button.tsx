import { twMerge } from "tailwind-merge";

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export default function Button({children, onClick, className}: ButtonProps) {
    const classes = twMerge(`
        p-2 
        rounded 
        text-white 
        font-bold
        py-2
        px-4
        border-b-4
        rounded
        mx-2
        mt-4
        ${className ?? ''}
        `)

    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    )
}
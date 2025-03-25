interface DialogProps {
    children: React.ReactNode;
    someRef: React.RefObject<HTMLDialogElement>;
    onClick?: () => void;
}

export default function Dialog({children, someRef, onClick}: DialogProps) {
    return (
        <dialog ref={someRef} onClick={onClick} className='p-6 rounded-lg shadow-md m-auto bg-white'>
            {children}
        </dialog>
    )
}
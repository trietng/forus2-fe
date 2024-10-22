import { Link } from "react-router-dom";

export function Logo() {
    return (
        <Link to="/" className="flex items-center gap-x-2">
            <span className='font-bold text-white text-2xl'>frontend</span>
        </Link>
    )
}
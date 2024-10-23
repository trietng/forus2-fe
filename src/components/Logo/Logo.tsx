import { Link } from "react-router-dom";

export function Logo() {
    return (
        <Link to="/" className="flex items-center gap-x-2">
            <img src="/assets/logo.svg" alt="logo" className="w-32" />
        </Link>
    )
}
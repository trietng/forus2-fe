import { HomeIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

export function SideMenu() {
    const location = useLocation();

    return (
        <nav className="rounded-lg p-4 bg-primary">
            <Link to="/" className={"block rounded-lg p-3 hover:bg-black/10" + (location.pathname === "/" ? " bg-black/20 pointer-events-none" : "")}><HomeIcon className="mr-2 inline size-4"/> Home</Link>
            <Link to="/all" className={"block rounded-lg p-3 hover:bg-black/10" + (location.pathname === "/all" ? " bg-black/20 pointer-events-none" : "")}><BuildingLibraryIcon className="mr-2 inline size-4"/> All</Link>
        </nav>
    );
}
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchBarTypeDropdown } from "./SearchBarTypeDropdown";
import { $searchBarState } from "../../models/search-bar";
import { route } from "../../utils/search";

export function SearchBar() {
    const navigate = useNavigate();
    const searchBarState = useStore($searchBarState);
    const [searchInput, setSearchInput] = useState('');
    
    return (
        <form className="flex" onSubmit={async (e) => {
            e.preventDefault();
            if (e.currentTarget.checkValidity()) {
                navigate(route(searchInput, searchBarState.type.toLocaleLowerCase()));
            }
        }}>
            <input className="rounded-s-md rounded-e-none bg-light text-nowrap w-full border-0" type="search" placeholder="Keywords..." aria-label="Search" onChange={(e) => setSearchInput(e.target.value)}/>
            <SearchBarTypeDropdown />
            <Button color="purple" className="rounded-md ms-2" type="submit" >
                <MagnifyingGlassIcon className="size-5 me-2"/>
                Search
            </Button>
        </form>
    );
}
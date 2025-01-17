import { useState } from "react";
import { useStore } from "@nanostores/react";
import { Button, Input } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { SearchBarTypeDropdown } from "./SearchBarTypeDropdown";
import { $searchBarState } from "../../models/search-bar";
import { route } from "../../utils/search";

export function SearchBar() {
    const navigate = useNavigate();
    const searchBarState = useStore($searchBarState);
    const [searchInput, setSearchInput] = useState('');
    
    return (
        <form className="flex text-black" onSubmit={async (e) => {
            e.preventDefault();
            if (e.currentTarget.checkValidity()) {
                navigate(route(searchInput, searchBarState.type.toLocaleLowerCase()));
            }
        }}>
            <Input className="bg-light text-nowrap w-full [&_div]:rounded-e-none" type="search" placeholder="Keywords..." aria-label="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
            <SearchBarTypeDropdown />
            <Button color="secondary" className="ms-2" type="submit" >
                Search
            </Button>
        </form>
    );
}
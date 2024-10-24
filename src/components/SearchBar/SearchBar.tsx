import { useState } from "react";
import { useStore } from "@nanostores/react";
import { SearchBarTypeDropdown } from "./SearchBarTypeDropdown";
import { $searchBarState } from "./SearchBarStore";
import { Button } from "flowbite-react";

export function SearchBar() {
    const searchBarState = useStore($searchBarState);
    const [searchInput, setSearchInput] = useState('');
    
    return (
        <form className="flex ms-4" onSubmit={async (e) => {
            e.preventDefault();
            if (e.currentTarget.checkValidity()) {
                searchBarState.searchButtonDisabled = true;
                searchBarState.searchInputDisabled = true;
                // window.location.href = route(query, type.toLocaleLowerCase());
            }
        }}>
            <input className="rounded-s-md rounded-e-none bg-light" type="search" placeholder="Keywords..." aria-label="Search" onChange={(e) => setSearchInput(e.target.value)}/>
            <SearchBarTypeDropdown />
            <Button color="purple" className="rounded-md ms-2" type="submit" disabled={searchBarState.searchButtonDisabled}>Search</Button>
        </form>
    );
}
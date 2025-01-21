import { Select, SelectItem } from "@heroui/react";
import { $searchBarState, SearchBarTypeSet } from "../../models/search-bar";

export function SearchBarTypeDropdown() {
    return (
        <Select aria-label="Search type" className="w-5/12 md:w-full [&_button]:rounded-s-none" defaultSelectedKeys={['Thread']}>
            {SearchBarTypeSet.map((type) => (
                <SelectItem key={type} onPress={() => $searchBarState.setKey('type', type)}>{type}</SelectItem>
            ))}
        </Select>
    );
}
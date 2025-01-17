import { Select, SelectItem } from "@heroui/react";
import { $searchBarState, SearchBarTypeSet } from "../../models/search-bar";

export function SearchBarTypeDropdown() {
    return (
        <Select className="[&_button]:rounded-s-none" defaultSelectedKeys={['Thread']}>
            {SearchBarTypeSet.map((type) => (
                <SelectItem key={type} onPress={() => $searchBarState.setKey('type', type)}>{type}</SelectItem>
            ))}
        </Select>
    );
}
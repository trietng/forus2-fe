import { useStore } from "@nanostores/react";
import { Dropdown } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { $searchBarState } from "../../models/search-bar";

const customTheme: CustomFlowbiteTheme['dropdown'] = {
    floating: {
        target: 'rounded-s-none border-s-1 border-e-0 border-y-0',
    }
};

export function SearchBarTypeDropdown() {
    const searchBarState = useStore($searchBarState);

    return (
        <Dropdown label={searchBarState.type} color="light" theme={customTheme}>
            <Dropdown.Item onClick={() => $searchBarState.setKey('type', 'Thread')}>Thread</Dropdown.Item>
            <Dropdown.Item onClick={() => $searchBarState.setKey('type', 'User')}>User</Dropdown.Item>
            <Dropdown.Item onClick={() => $searchBarState.setKey('type', 'Box')}>Box</Dropdown.Item>
        </Dropdown>
    );
}
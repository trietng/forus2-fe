import { useStore } from "@nanostores/react";
import { $searchBarState } from "./SearchBarStore";
import { Dropdown } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";

const customTheme: CustomFlowbiteTheme['dropdown'] = {
    floating: {
        target: 'rounded-s-none',
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
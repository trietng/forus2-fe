import { Button, Drawer, DrawerContent } from "@heroui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { SideMenu } from "./SideMenu";

export function SideMenuDropdown() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <>
            <Button className="text-white mr-4" variant="bordered" aria-label="Open sidebar" onPress={() => setOpenSidebar(true)}>
                <Bars3Icon className="size-8"/>
            </Button>
            <Drawer isOpen={openSidebar} onClose={() => setOpenSidebar(false)} placement="left">
                <DrawerContent>
                    <SideMenu className="bg-opacity-0 m-5" onNavigate={() => setOpenSidebar(false)}/>
                </DrawerContent>
            </Drawer>
        </>
    );
}
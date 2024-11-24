import { Button, Drawer, Sidebar } from "flowbite-react";
import { Bars3Icon, BuildingLibraryIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function SideMenuDropdown() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <>
            <Button color="primary" aria-label="Open sidebar" onClick={() => setOpenSidebar(true)}>
                <Bars3Icon className="size-8"/>
            </Button>
            <Drawer open={openSidebar} onClose={() => setOpenSidebar(false)}>
                <Drawer.Items>
                    <Sidebar
                    aria-label="Sidebar with multi-level dropdown"
                    className="[&>div]:bg-transparent [&>div]:p-0"
                    >
                        <Sidebar.Items>
                            <Sidebar.ItemGroup>
                                <Sidebar.Item href="/" icon={HomeIcon}>Home</Sidebar.Item>
                                <Sidebar.Item href="/all" icon={BuildingLibraryIcon}>All</Sidebar.Item>
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </Sidebar>
                </Drawer.Items>
            </Drawer>
        </>
    );
}
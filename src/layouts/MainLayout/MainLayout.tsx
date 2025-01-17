import { BoxInformation } from "../../components/Control/Box";
import { SideMenu } from "../../components/SideMenu";
import { Outlet } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";

interface MainLayoutProps {
    showBoxInformation?: boolean;
}

export function MainLayout(props: MainLayoutProps) {
    return (
        <HeroUIProvider className="w-full my-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3 hidden md:block">
                <SideMenu />
                {props.showBoxInformation === true && 
                    <div className="mt-4">
                        <BoxInformation />
                    </div>
                }
            </div>
            <div className="md:col-span-9">
                <Outlet />
            </div>
        </HeroUIProvider>
    );
}
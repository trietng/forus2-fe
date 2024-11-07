import { BoxInformation } from "../../components/Control/Box";
import { SideMenu } from "../../components/SideMenu";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
    showBoxInformation?: boolean;
}

export function MainLayout(props: MainLayoutProps) {
    return (
        <div className="w-full my-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3 hidden md:block">
                {props.showBoxInformation === true && 
                    <div className="mb-4">
                        <BoxInformation />
                    </div>
                }
                <SideMenu />
            </div>
            <div className="md:col-span-9">
                <Outlet />
            </div>
        </div>
    );
}
import { SideMenu } from "../../components/SideMenu";
import { Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="w-full my-8 grid md:grid-cols-12 gap-8">
            <div className="hidden md:col-span-3 md:block">
                <SideMenu />
            </div>
            <div className="md:col-span-9">
                <Outlet />
            </div>
        </div>
    );
}
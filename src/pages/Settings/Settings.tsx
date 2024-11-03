import { lazy, Suspense } from "react";
import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Bounce, ToastContainer } from "react-toastify";
import { FallbackSpinner } from "../../components/FallbackSpinner";
import Profile from "./Profile";
const Security = lazy(() => import("./Security"));

const customThemeTabs: CustomFlowbiteTheme['tabs'] = {
    tablist: {
        variant: {
            underline: "border-b-0 gap-x-4 px-4"
        },
        tabitem: {
            variant: {
                underline: {
                    active: {
                        off: "text-primary hover:text-secondary rounded-t-none border-b-2 border-primary hover:border-secondary",
                        on: "text-secondary hover:text-secondary/80 rounded-t-none border-b-2 border-secondary hover:border-secondary/80",
                    }
                }
            }
        }
    },
    tabpanel: "py-3 min-h-80"
};

export function Settings() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
            <div className="w-full bg-body-secondary my-8 rounded-lg">
                <Tabs aria-label="Setting tabs" variant="underline" theme={customThemeTabs}>
                    <Tabs.Item active title="Profile" icon={UserCircleIcon}>
                        <Profile />
                    </Tabs.Item>
                    <Tabs.Item title="Security" icon={LockClosedIcon}>
                        <Suspense fallback={<FallbackSpinner/>}>
                            <Security />
                        </Suspense>
                    </Tabs.Item>
                </Tabs>
            </div>
        </>
    );
}
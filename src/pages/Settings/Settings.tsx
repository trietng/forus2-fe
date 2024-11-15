import { lazy, Suspense } from "react";
import { Tabs } from "flowbite-react";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FallbackSpinner } from "../../components/FallbackSpinner";
import Profile from "./Profile";
const Security = lazy(() => import("./Security"));

export function Settings() {
    return (
        <div className="w-full bg-body-secondary my-8 rounded-lg">
            <Tabs aria-label="Setting tabs" variant="underline">
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
    );
}
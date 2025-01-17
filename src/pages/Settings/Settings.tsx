import { lazy, Suspense } from "react";
import { Tabs, Tab } from "@heroui/react";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FallbackSpinner } from "../../components/FallbackSpinner";
import Profile from "./Profile";
const Security = lazy(() => import("./Security"));

export function Settings() {
    return (
        <div className="w-full bg-forus-primary my-8 rounded-lg">
            <Tabs aria-label="Setting tabs" variant="underlined" color="secondary">
                <Tab title={
                    <div className="flex gap-2">
                        <UserCircleIcon className="size-6"/>
                        <span>Profile</span>
                    </div>
                }>
                    <Profile mode="edit"/>
                </Tab>
                <Tab title={
                    <div className="flex gap-2">
                        <LockClosedIcon className="size-6"/>
                        <span>Security</span>
                    </div>
                } >
                    <Suspense fallback={<FallbackSpinner/>}>
                        <Security />
                    </Suspense>
                </Tab>
            </Tabs>
        </div>
    );
}
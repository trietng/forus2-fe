import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import Profile from "../Settings/Profile";
import { Tabs, Tab } from "@heroui/react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import { FallbackSpinner } from "../../components/FallbackSpinner";
const Threads = lazy(() => import("./Threads"));
const Comments = lazy(() => import("./Comments"));

export function User() {
    const params = useParams();
    
    return (
        <div className="w-full my-8 grid md:grid-cols-5 gap-8">
            <div className="bg-forus-primary rounded-lg p-4 md:col-span-2 min-h-32">
                <Profile mode="view" id={params.id}/>
            </div>
            <div className="bg-forus-primary rounded-lg p-4 md:col-span-3">
                <Tabs aria-label="User tabs" variant="underlined" color="secondary" classNames={{
                    panel: "min-h-72 [&_ul]:max-h-[480px] md:[&_ul]:max-h-[360px]"
                }}>
                    <Tab title={
                        <div className="flex gap-2">
                            <ChatBubbleBottomCenterTextIcon className="size-6"/>
                            <span>Threads</span>
                        </div>
                    }>
                        <Suspense fallback={<FallbackSpinner className="h-72"/>}>
                            <Threads userId={params.id}/>
                        </Suspense>
                    </Tab>
                    <Tab title={
                        <div className="flex gap-2">
                            <ChatBubbleBottomCenterTextIcon className="size-6"/>
                            <span>Comments</span>
                        </div>
                    }>
                        <Suspense fallback={<FallbackSpinner className="h-72"/>}>
                            <Comments userId={params.id}/>
                        </Suspense>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
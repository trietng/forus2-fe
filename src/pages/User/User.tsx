import { useParams } from "react-router-dom";
import Profile from "../Settings/Profile";
import { Tabs, Tab } from "@heroui/react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";

export function User() {
    const params = useParams();
    
    return (
        <div className="w-full my-8 grid md:grid-cols-5 gap-8">
            <div className="bg-forus-primary rounded-lg p-4 md:col-span-2">
                <Profile mode="view" id={params.id}/>
            </div>
            <Tabs className="bg-forus-primary rounded-lg md:col-span-3" aria-label="Setting tabs" variant="underlined" color="secondary">
                <Tab title={
                    <div className="flex gap-2">
                        <ChatBubbleBottomCenterTextIcon className="size-6"/>
                        <span>Threads</span>
                    </div>
                }>
                </Tab>
                <Tab title={
                    <div className="flex gap-2">
                        <ChatBubbleBottomCenterTextIcon className="size-6"/>
                        <span>Comments</span>
                    </div>
                }>
                </Tab>
            </Tabs>
        </div>
    );
}
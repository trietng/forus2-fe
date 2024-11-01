import { Avatar, CustomFlowbiteTheme, FloatingLabel, Tabs, Textarea } from "flowbite-react";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Payload } from "../../models/payload";
import { getDecodedPayload } from "../../helpers/jwt";

const customTheme: CustomFlowbiteTheme['tabs'] = {
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
    }
};

export function Settings() {
    const [user] = useState<Payload | undefined>(getDecodedPayload());

    return (
        <div className="w-full bg-body-secondary my-8 rounded-lg">
            <Tabs aria-label="Setting tabs" variant="underline" theme={customTheme}>
                <Tabs.Item active title="Profile" icon={UserCircleIcon}>
                    <div className="flex flex-col gap-4 px-4 [&_label]:bg-body-secondary [&_label]:text-white text-white">
                        <div className="flex gap-4">
                            <Avatar img={user?.avatarUrl} alt={user?.username} size="lg" />
                            <Textarea placeholder="Tell us about yourself" className="resize-none"/>
                        </div>
                        <FloatingLabel label='Username' variant='outlined' name='username' type='text' required disabled value={user?.username} />
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Security" icon={LockClosedIcon}>

                </Tabs.Item>
            </Tabs>
        </div>
    );
}
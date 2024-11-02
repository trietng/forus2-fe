import { ChangeEvent, useEffect, useState } from "react";
import { Avatar, Button, CustomFlowbiteTheme, Datepicker, Label, Tabs, Textarea, TextInput } from "flowbite-react";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Payload } from "../../models/payload";
import { getDecodedPayload } from "../../helpers/jwt";
import { UserRoleMap } from "../../models/role";
import { api } from "../../api";
import { MutableUserDetails, ImmutableUserDetails } from "../../models/userdetails";
import { DESCRIPTION_MAX_LENGTH, DISPLAY_NAME_MAX_LENGTH } from "../../constants/validation";

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
    }
};

export function Settings() {
    const [payload] = useState<Payload | undefined>(getDecodedPayload());
    const [immutableUserDetails, setImmutableUserDetails] = useState<ImmutableUserDetails>();
    const [formData, setFormData] = useState<MutableUserDetails>({description: undefined, displayName: '', dateOfBirth: undefined});

    async function fetchUser() {
        const { data } = await api('v1/userdetails');
        const { description, displayName, dateOfBirth, ...immutable } = data;
        setFormData({description, displayName, dateOfBirth });
        const { email, createdAt } = immutable;
        setImmutableUserDetails({email, createdAt});
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleDateInputChange = (date: Date | null) => {
        setFormData({...formData, dateOfBirth: date || new Date(0)});
    }

    async function partialUpdateUser() {
        const response = await api.patch('v1/userdetails', formData);
        toast.success(response.data.message);
    }

    useEffect(() => {
        fetchUser();
    }, []);

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
                        <div className="px-4 [&_label]:text-white">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <Avatar img={payload?.avatarUrl} size="lg" title="Click to change your avatar" className="cursor-pointer"/>
                                    <span className="block text-sm font-medium">{payload?.username}</span>
                                    {payload?.role && <span className="block text-sm">{UserRoleMap[payload.role]}</span>}
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between">
                                        <Label htmlFor="description" value="Description" />
                                        <span className="text-sm">{formData?.description?.length || 0}/{DESCRIPTION_MAX_LENGTH}</span>
                                    </div>
                                    <Textarea placeholder="Tell us about yourself" name="description" className="text-black h-full resize-none mt-1" value={formData?.description} maxLength={DESCRIPTION_MAX_LENGTH} onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                <div>
                                    <Label htmlFor="email" value="Email" />
                                    <TextInput className="text-white mt-1" name='email' type='email' disabled value={immutableUserDetails?.email}/>
                                </div>
                                <div>
                                    <Label htmlFor="joinDate" value="Join date" />
                                    <Datepicker className="mt-1" label='Join date' name='joinDate' disabled value={immutableUserDetails?.createdAt || new Date(0)}/>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <Label htmlFor="displayName" value="Display name" />
                                        <span className="text-sm">{formData?.displayName.length || 0}/{DISPLAY_NAME_MAX_LENGTH}</span>
                                    </div>
                                    <TextInput className="text-white mt-2" name='displayName' type='text' required value={formData?.displayName} onChange={handleInputChange}/>
                                </div>
                                <div>
                                    <Label htmlFor="dateOfBirth" value="Date of birth" />
                                    <Datepicker className="mt-1" label='Date of birth' name='dateOfBirth' value={formData?.dateOfBirth || new Date(0)} onChange={handleDateInputChange}/>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={partialUpdateUser} className="place-items-end" color="secondary">Save changes</Button>
                            </div>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item title="Security" icon={LockClosedIcon}>

                    </Tabs.Item>
                </Tabs>
            </div>
        </>
    );
}
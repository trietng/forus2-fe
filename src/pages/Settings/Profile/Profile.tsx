import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Modal, Textarea, Input, Spinner, ModalContent, ModalBody, DatePicker } from "@heroui/react";
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { parseAbsolute, ZonedDateTime } from "@internationalized/date";
import { Payload } from "../../../models/payload";
import { getDecodedPayload } from "../../../helpers/jwt";
import { UserRoleMap } from "../../../models/role";
import { api } from "../../../api";
import { MutableUserDetails, ImmutableUserDetails } from "../../../models/userdetails";
import { DESCRIPTION_MAX_LENGTH } from "../../../constants/validation";
import { uploadImage, deleteImage, getImage } from "../../../firebase/image";
import { ACCEPTED_IMAGE_MIME_TYPES, FILE_INPUT_ACCEPT_VALUE } from "../../../utils/image";
import { UNIX_EPOCH_ZERO_ZONED_DATETIME, UTC_TIMEZONE } from "../../../constants/time";

type ProfileMode = "view" | "edit";

interface ProfileProps {
    mode: ProfileMode;
    id?: string;
}

export function Profile(props: ProfileProps) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [payload] = useState<Payload | undefined>(getDecodedPayload());
    const [immutableUserDetails, setImmutableUserDetails] = useState<ImmutableUserDetails>();
    const [formData, setFormData] = useState<MutableUserDetails>({description: undefined, displayName: '', dateOfBirth: undefined});
    const [openModal, setOpenModal] = useState(false);
    const [canUpload, setCanUpload] = useState(true);
    const [avatar, setAvatar] = useState<string>();

    async function fetchUser(id?: string) {
        const { data } = await api.get(`/v1/users/${id}`);
        const { description, displayName, dateOfBirth, ...immutable } = data;
        setFormData({ description, displayName, dateOfBirth });
        const { email, createdAt } = immutable;
        setImmutableUserDetails({ email, createdAt });
        await getAvatarImage();
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleDateInputChange = (date: ZonedDateTime | null) => {
        setFormData({...formData, dateOfBirth: date?.toString()});
    }

    async function partialUpdateUser() {
        const response = await api.patch(`v1/users/${payload?.id}`, formData);
        toast.success(response.data.message);
    }

    async function pickImage() {
        fileInputRef.current?.click();
    }

    async function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (!ACCEPTED_IMAGE_MIME_TYPES.has(file?.type)) {
                toast.error('Invalid file type. Please upload an image file.');
                return;
            }
            // TODO: Remote CRON job to delete old images
            setCanUpload(false);
            const avatarUrl = await uploadImage(file, '/avatars');
            try {
                await api.patch(`v1/users/${payload?.id}`, { avatarUrl });
                setOpenModal(true);
            }
            catch (error) {
                toast.error('Failed to update avatar. Please try again later.');
                // delete the uploaded image if the request fails
                try {
                    await deleteImage(avatarUrl);
                }
                catch (error) {
                    // Suppress the error
                }
            }
            finally {
                setCanUpload(true);
            }
        }
    }

    async function logout() {
        setOpenModal(false);
        await api.delete('v1/auth/logout');
        navigate('/login');
    }

    async function getAvatarImage() {
        if (payload?.avatarUrl) {
            const image = await getImage(payload.avatarUrl);
            setAvatar(image);
        }
    }

    useEffect(() => {
        if (props.mode === "edit") {
            fetchUser(payload?.id);
        } else {
            fetchUser(props.id);
        }
    }, [props.id]);


    return (
        <>
            {props.mode === "edit" && <Modal className="bg-forus-body-secondary"isOpen={openModal} size="md" onClose={() => setOpenModal(false)}>
                <ModalContent>
                    <ModalBody>
                        <div className="text-center">
                            <CheckCircleIcon className="mx-auto mb-4 size-14 text-green-500" />
                            <h3 className="mb-5 font-normal text-white">
                                Avatar updated successfully.
                                <div>Please logout and login again to see the changes.</div>
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="secondary" onPress={() => logout()}>
                                    Logout
                                </Button>
                                <Button onPress={() => setOpenModal(false)}>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>}
            <div className="px-4 [&_label]:text-white">
                <div className={"grid gap-4" + (props.mode === "edit" ? " md:flex" : "")}>
                    <div className="text-center">
                        {props.mode === "edit" ?
                        <div className={"relative bg-transparent text-transparent hover:text-white cursor-pointer" + (canUpload ? "" : " pointer-events-none")} onClick={pickImage} >
                            { canUpload ?
                            <PencilIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 z-10 pointer-events-none"/> : 
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <Spinner color="secondary" className="size-8"/>
                            </div> }
                            <Avatar src={avatar} size="lg" title="Click to change your avatar" className={"place-self-center [&_img]:opacity-100 hover:brightness-50" + (canUpload ? "" : " brightness-50")}/>
                            <Input type='file' className="hidden" accept={FILE_INPUT_ACCEPT_VALUE} name="avatar" ref={fileInputRef} onChange={onFileInputChange}/>
                        </div> :
                        <Avatar className="place-self-center [&_img]:opacity-100" src={avatar} size="lg"/>}
                        <span className="block text-sm font-medium">{payload?.username}</span>
                        {payload?.role && <span className="block text-sm">{UserRoleMap[payload.role]}</span>}
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                            <label htmlFor="description">Description</label>
                            <span className="text-sm">{formData?.description?.length || 0}/{DESCRIPTION_MAX_LENGTH}</span>
                        </div>
                        <Textarea placeholder="Tell us about yourself" name="description" className="text-black h-full resize-none mt-1" value={formData?.description} maxLength={DESCRIPTION_MAX_LENGTH} onChange={handleInputChange} isReadOnly={props.mode === "view"}/>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-4 mt-4">
                    <Input label="Email" className="text-white" name='email' type='email' isDisabled={props.mode === "edit"} readOnly={props.mode === "view"} value={immutableUserDetails?.email || ''}/>
                    <div>
                        <Input label="Display name" className="text-white" name='displayName' type='text'  value={formData?.displayName || ''} onChange={handleInputChange} isReadOnly={props.mode === "view"}/>
                    </div>
                    <DatePicker granularity="day" label='Join date' name='joinDate' isDisabled value={parseAbsolute(immutableUserDetails?.createdAt || UNIX_EPOCH_ZERO_ZONED_DATETIME, UTC_TIMEZONE)} isReadOnly/>
                    <DatePicker granularity="day" label='Date of birth' name='dateOfBirth' value={parseAbsolute(formData?.dateOfBirth || UNIX_EPOCH_ZERO_ZONED_DATETIME, UTC_TIMEZONE)} onChange={handleDateInputChange} isDisabled={props.mode === "view"}/>
                </div>
                {props.mode === "edit" && <div className="flex justify-end mt-8">
                    <Button onPress={partialUpdateUser} className="place-items-end" color="secondary">Save changes</Button>
                </div>}
            </div>
        </>
    );
}
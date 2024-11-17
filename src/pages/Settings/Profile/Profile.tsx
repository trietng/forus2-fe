import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Datepicker, FileInput, Label, Modal, Textarea, TextInput, Spinner } from "flowbite-react";
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { Payload } from "../../../models/payload";
import { getDecodedPayload } from "../../../helpers/jwt";
import { UserRoleMap } from "../../../models/role";
import { api } from "../../../api";
import { MutableUserDetails, ImmutableUserDetails } from "../../../models/userdetails";
import { DESCRIPTION_MAX_LENGTH, DISPLAY_NAME_MAX_LENGTH } from "../../../constants/validation";
import { uploadImage, deleteImage, getImage } from "../../../firebase/image";
import { ACCEPTED_IMAGE_MIME_TYPES, FILE_INPUT_ACCEPT_VALUE } from "../../../utils/image";

export function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [payload] = useState<Payload | undefined>(getDecodedPayload());
    const [immutableUserDetails, setImmutableUserDetails] = useState<ImmutableUserDetails>();
    const [formData, setFormData] = useState<MutableUserDetails>({description: undefined, displayName: '', dateOfBirth: undefined});
    const [openModal, setOpenModal] = useState(false);
    const [canUpload, setCanUpload] = useState(true);
    const [avatar, setAvatar] = useState<string>();

    async function fetchUser() {
        const { data } = await api('v1/userdetails');
        const { description, displayName, dateOfBirth, ...immutable } = data;
        setFormData({ description, displayName, dateOfBirth });
        const { email, createdAt } = immutable;
        setImmutableUserDetails({ email, createdAt });
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
            const avatarUrl = await uploadImage(file);
            try {
                await api.patch('v1/userdetails', { avatarUrl });
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
        fetchUser();
        getAvatarImage();
    }, []);


    return (
        <>
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                <div className="text-center">
                    <CheckCircleIcon className="mx-auto mb-4 size-14 text-green-500" />
                    <h3 className="mb-5 font-normal text-white">
                        Avatar updated successfully.
                        <div>Please logout and login again to see the changes.</div>
                    </h3>
                    <div className="flex justify-center gap-4">
                    <Button color="secondary" onClick={() => logout()}>
                        Logout
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Continue
                    </Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
            <div className="px-4 [&_label]:text-white">
                <div className="grid md:flex gap-4">
                    <div className="text-center">
                        <div className={"relative bg-transparent text-transparent hover:text-white cursor-pointer" + (canUpload ? "" : " pointer-events-none")} onClick={pickImage} >
                            { canUpload ?
                            <PencilIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 z-10 pointer-events-none"/> : 
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <Spinner color="secondary" className="size-8"/>
                            </div> }
                            <Avatar img={avatar} size="lg" title="Click to change your avatar" className={"hover:brightness-50" + (canUpload ? "" : " brightness-50")}/>
                            <FileInput className="hidden" accept={FILE_INPUT_ACCEPT_VALUE} name="avatar" ref={fileInputRef} onChange={onFileInputChange}/>
                        </div>
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
                <div className="grid md:grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                        <Label htmlFor="email" value="Email" />
                        <TextInput className="text-white mt-1" name='email' type='email' disabled value={immutableUserDetails?.email || ''}/>
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
                        <TextInput className="text-white mt-2" name='displayName' type='text'  value={formData?.displayName || ''} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <Label htmlFor="dateOfBirth" value="Date of birth" />
                        <Datepicker className="mt-1" label='Date of birth' name='dateOfBirth' value={formData?.dateOfBirth || new Date(0)} onChange={handleDateInputChange}/>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <Button onClick={partialUpdateUser} className="place-items-end" color="secondary">Save changes</Button>
                </div>
            </div>
        </>
    );
}
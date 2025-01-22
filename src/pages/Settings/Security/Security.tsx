import { useState } from "react";
import { CheckCircleIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { Button, Modal, ModalBody, ModalContent, Spinner } from "@heroui/react";
import { useStore } from "@nanostores/react";
import { api } from "../../../api";
import { $email } from "../Profile/Profile";
import { DataState } from "../../../models/data-state";
import { useNavigate } from "react-router-dom";

export function Security() {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [state, setState] = useState<DataState>("idle");
    const email = useStore($email);

    async function sendPasswordResetEmail() {
        setState("loading");
        setOpenModal(false);
        try {
            await api.post('/v1/auth/forgot_password', {email});
            await api.delete('/v1/auth/logout');
            navigate('/email_sent', { state: { address: email } });
        } finally {
            setState("idle");
        }
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4 mx-4">
            <Button type='submit' color='secondary' onPress={() => setOpenModal(true)}><LockOpenIcon className="size-4"/>Change password</Button>
            <Modal  className="bg-forus-body-secondary" isOpen={openModal} size="md" onClose={() => {
                if (state === 'idle') {
                    setOpenModal(false);
                }
            }}>
                <ModalContent>
                    <ModalBody className="min-h-64">
                        {state === 'idle' ? <div className="text-center">
                            <CheckCircleIcon className="mx-auto mb-4 size-14 text-green-500" />
                            <h3 className="mb-5 font-normal text-white">
                                You are requesting to change your password for the account with email address <span className="font-bold">{email}</span>.
                                <div>This action will log you out. Are you sure you want to continue?</div>
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="danger" onPress={() => sendPasswordResetEmail()}>
                                    Continue
                                </Button>
                                <Button onPress={() => setOpenModal(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div> : <Spinner color="secondary" className="h-64" />}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
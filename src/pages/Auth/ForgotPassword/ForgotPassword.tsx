import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Input } from '@heroui/react';
import { toast } from 'react-toastify';
import { api } from '../../../api';
import { FormValidationData } from '../../../models/form-validation-data';
import { VALIDATION_MESSAGE_FORM } from '../../../constants/validation';


interface ForgotPasswordFormData {
    email: string;
}

export function ForgotPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ForgotPasswordFormData>({email: ''});
    const [formValidation, setFormValidation] = useState<Record<keyof ForgotPasswordFormData, FormValidationData>>({
        email: {status: true, message: ''}
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValidation({...formValidation, [e.target.name]: {status: e.target.validity.valid, message: e.target.validationMessage}});
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!Object.values(formValidation).every(validation => validation.status)) {
            toast.error(VALIDATION_MESSAGE_FORM);
        }
        else {
            await api.post('/v1/auth/forgot_password', formData);
            navigate('/email_sent', { state: { address: formData.email } });
        }
    }

    return (
        <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
            <form className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4' onSubmit={handleSubmit} noValidate>
                <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                <h1 className='text-3xl font-semibold text-black text-center'>Forgot Password</h1>
                <Input type='email' label='Email' name='email' required onChange={handleInputChange} />
                <Button type='submit' className='w-full' color='primary'>Submit</Button>
            </form>
        </div>
    );
}
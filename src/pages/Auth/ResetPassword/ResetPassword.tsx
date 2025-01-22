import { useSearchParams } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Input, Link, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';
import { api } from '../../../api';
import { FormValidationData } from '../../../models/form-validation-data';
import { VALIDATION_MESSAGE_FORM } from '../../../constants/validation';
import { DataState } from '../../../models/data-state';

interface ResetPasswordFormData {
    newPassword: string;
}

type ResetPasswordDataState = DataState | 'verified';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<ResetPasswordDataState>('idle');
    const [formData, setFormData] = useState<ResetPasswordFormData>({newPassword: ''});
    const [formValidation, setFormValidation] = useState<Record<keyof ResetPasswordFormData, FormValidationData>>({
        newPassword: {status: true, message: ''}
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
            setState('loading');
            try {
                await api.post('/v1/auth/reset_password', {
                    token: searchParams.get('token'),
                    newPassword: formData.newPassword
                });
                setState('verified');
            } catch (e) {
                setState('idle');
            }
        }
    }

    return (
        <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
            {state === 'idle' ?
            <form className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4' onSubmit={handleSubmit} noValidate>
                <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                <h1 className='text-3xl font-semibold text-black text-center'>Reset Password</h1>
                <Input type='password' label='New Password' name='newPassword' required onChange={handleInputChange} />
                <Button type='submit' className='w-full' color='primary'>Submit</Button>
            </form> : (
            state === 'loading' ?
            <Spinner color='secondary'/> : (
            state === 'verified' ?
            <div className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4'>
                <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                <h1 className='text-3xl font-semibold text-black text-center'>Password Reset</h1>
                <p className='text-black text-center'>Your password has been reset successfully.</p>
                <Button href='/login' as={Link}> Go to login page</Button>
            </div> : null
            ))}
        </div>
    );
}
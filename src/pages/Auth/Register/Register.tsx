import { useNavigate } from 'react-router-dom';
import { ChangeEvent, createRef, FormEvent, useEffect, useState } from 'react';
import { Button, Input, Link, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';
import { api } from '../../../api';
import { FormValidationData } from '../../../models/form-validation-data';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VALIDATION_MESSAGE_CONFIRM_PASSWORD, VALIDATION_MESSAGE_FORM } from '../../../constants/validation';
import { DataState } from '../../../models/data-state';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
}

export function Register() {
    const navigate = useNavigate();
    const passwordRef = createRef<HTMLInputElement>();
    const [state, setState] = useState<DataState>('idle');
    const [formData, setFormData] = useState<RegisterFormData>({username: '', email: '', password: '', confirmPassword: '', displayName: ''});
    const [formValidation, setFormValidation] = useState<Record<keyof RegisterFormData, FormValidationData>>({
        username: {status: true, message: ''},
        email: {status: true, message: ''},
        password: {status: true, message: ''},
        confirmPassword: {status: true, message: ''},
        displayName: {status: true, message: ''}
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValidation({...formValidation, [e.target.name]: {status: e.target.validity.valid, message: e.target.validationMessage}});
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValidation({...formValidation, confirmPassword: {status: formData.confirmPassword === "" || e.target.value === formData.confirmPassword, message: VALIDATION_MESSAGE_CONFIRM_PASSWORD}});
        console.log(e.target.value, formData.confirmPassword);
        setFormData({...formData, password: e.target.value});
    }

    const handleConfirmPasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValidation({...formValidation, confirmPassword: {status: formData.password === "" || e.target.value === formData.password, message: VALIDATION_MESSAGE_CONFIRM_PASSWORD}});
        setFormData({...formData, confirmPassword: e.target.value});
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!Object.values(formValidation).every(validation => validation.status)) {
            toast.error(VALIDATION_MESSAGE_FORM);
        }
        else {
            setState('loading');
            const { confirmPassword, ...registerFormData } = formData;
            try {
                await api.post('/v1/auth/register', registerFormData);
                const { email } = registerFormData;
                navigate('/email_sent', { state: { address: email } });
            } finally {
                setState('idle');
            }
        }
    }

    useEffect(() => {
        if (!formValidation.confirmPassword.status) {
            passwordRef.current?.setAttribute('color', 'danger');
        }
    }, [formValidation.confirmPassword.status]);

    return (
        <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
            {state === 'idle' ?
            <form className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4' onSubmit={handleSubmit} noValidate>
                <img src='/assets/logo.svg' className='w-2/3 self-center'/>
                <h1 className='text-3xl font-semibold text-black text-center'>Register</h1>
                <Input label='Username' name='username' type='text' onChange={handleInputChange} required/>
                <Input label='Email' name='email' type='email' onChange={handleInputChange} required/>
                <Input ref={passwordRef} errorMessage={formValidation.confirmPassword.message !== '' ? formValidation.confirmPassword.message : undefined} isInvalid={!formValidation.confirmPassword.status} label='Password' name='password' type='password' onChange={handlePasswordInputChange} minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_LENGTH} current-password />
                <Input label='Confirm password' name='confirmPassword' type='password' onChange={handleConfirmPasswordInputChange} />
                <Input label='Display name' name='displayName' type='text' onChange={handleInputChange} required minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_LENGTH}/>
                <Button color='primary' type='submit'>Register</Button>
                <Button color='secondary' as={Link} href='/login'>Login</Button>
                <div className='self-center mt-12'>&copy; 2023-2024 ForUS</div>
            </form> :
            <Spinner color='secondary'/>}
        </div>
    );
}
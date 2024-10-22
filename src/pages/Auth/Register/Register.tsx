import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { api } from '../../../api';
import { Button, FloatingLabel } from 'flowbite-react';
import { Divider } from '../../../components/Divider';
import { FormValidationData } from '../../../models/form-validation-data';
import { ValidationMessage } from '../../../components/Validation/ValidationMessage';
import { colorFromValidation } from '../../../helpers/flowbite/validation';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VALIDATION_MESSAGE_CONFIRM_PASSWORD } from '../../../constants/validation';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterFormData>({username: '', email: '', password: '', confirmPassword: ''});
    const [formValidation, setFormValidation] = useState<Record<keyof RegisterFormData, FormValidationData>>({
        username: {status: true, message: ''},
        email: {status: true, message: ''},
        password: {status: true, message: ''},
        confirmPassword: {status: true, message: ''}
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValidation({...formValidation, [e.target.name]: {status: e.target.validity.valid, message: e.target.validationMessage}});
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.validity.valid) {
            setFormValidation({...formValidation, password: {status: false, message: e.target.validationMessage}});
        }
        else {
            setFormValidation({...formValidation, password: {status: true, message: ''}});
        }
        setFormValidation({...formValidation, confirmPassword: {status: e.target.value === formData.confirmPassword, message: VALIDATION_MESSAGE_CONFIRM_PASSWORD}});
        setFormData({...formData, password: e.target.value});
    }

    const handleConfirmPasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValidation({...formValidation, confirmPassword: {status: e.target.value === formData.password, message: VALIDATION_MESSAGE_CONFIRM_PASSWORD}});
        setFormData({...formData, confirmPassword: e.target.value});
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api.post('/auth/login', formData);
        navigate('/');
    }

    return (
        <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
            <form className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4 [&_label]:bg-tertiary [&_label]:text-sm' onSubmit={handleSubmit}>
                <img src='/assets/logo-full.svg' className='w-2/3 self-center'/>
                <h1 className='text-3xl font-semibold text-black text-center'>Register</h1>
                <FloatingLabel label='Username' variant='outlined' name='username' type='text' onChange={handleInputChange} required color={colorFromValidation(formValidation.username)}/>
                <ValidationMessage formValidationData={formValidation.username} className='-mt-6 -mb-2'/>
                <FloatingLabel label='Email' variant='outlined' name='email' type='email' onChange={handleInputChange} required color={colorFromValidation(formValidation.email)}/>
                <ValidationMessage formValidationData={formValidation.email} className='-mt-6 -mb-2'/>
                <FloatingLabel label='Password' variant='outlined' name='password' type='password' onChange={handlePasswordInputChange} minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_LENGTH} color={colorFromValidation(formValidation.password)}/>
                <ValidationMessage formValidationData={formValidation.password} className='-mt-6 -mb-2'/>
                <FloatingLabel label='Confirm password' variant='outlined' name='confirmPassword' type='password' onChange={handleConfirmPasswordInputChange} color={colorFromValidation(formValidation.confirmPassword)}/>
                <ValidationMessage formValidationData={formValidation.confirmPassword} className='-mt-6 -mb-2'/>
                <Button color='blue'>Register</Button>
                <Divider />
                <Button color='yellow' className='bg-[unset]' onClick={() => navigate('/login')}>Login</Button>
                <div className='self-center mt-12'>&copy; 2023-2024 ForUS</div>
            </form>
        </div>
    );
}
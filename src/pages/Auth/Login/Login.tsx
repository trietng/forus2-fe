import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, FloatingLabel, HR } from 'flowbite-react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { api } from '../../../api';
import { FormValidationData } from '../../../models/form-validation-data';
import { ValidationMessage } from '../../../components/Validation/ValidationMessage';
import { colorFromValidation } from '../../../helpers/flowbite/validation';
import { VALIDATION_MESSAGE_FORM } from '../../../constants/validation';


interface LoginFormData {
    username: string;
    password: string;
}

export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({username: '', password: ''});
    const [formValidation, setFormValidation] = useState<Record<keyof LoginFormData, FormValidationData>>({
        username: {status: true, message: ''},
        password: {status: true, message: ''}
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
            await api.post('/auth/login', formData);
            navigate('/');
        }
    }

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
            <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
                <form className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4 [&_label]:bg-tertiary [&_label]:text-sm' onSubmit={handleSubmit} noValidate>
                    <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                    <h1 className='text-3xl font-semibold text-black text-center'>Login</h1>
                    <FloatingLabel 
                        label='Username'
                        variant='outlined'
                        name='username'
                        type='text'
                        required
                        color={colorFromValidation(formValidation.username)}
                        onChange={handleInputChange}
                    />
                    <ValidationMessage formValidationData={formValidation.username} className='-mt-6 -mb-2'/>
                    <FloatingLabel
                        label='Password'
                        variant='outlined'
                        name='password'
                        type='password'
                        minLength={4}
                        color={colorFromValidation(formValidation.password)}
                        onChange={handleInputChange}
                    />
                    <ValidationMessage formValidationData={formValidation.password} className='-mt-6 -mb-2'/>
                    <Button color='blue' type='submit'>Login</Button>
                    <HR className='my-0'/>
                    <Button color='yellow' onClick={() => navigate('/register')}>Register</Button>
                    <Button color='light' onClick={() => navigate('/forgot-password')}>Forgot password</Button>
                    <div className='self-center mt-12'>&copy; 2023-2024 ForUS</div>
                </form>
            </div>
        </>
    );
}
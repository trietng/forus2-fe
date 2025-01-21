import { useLocation, useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Input, Link, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { api } from '../../../api';
import { FormValidationData } from '../../../models/form-validation-data';
import { VALIDATION_MESSAGE_FORM } from '../../../constants/validation';


interface LoginFormData {
    username: string;
    password: string;
}

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
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
            await api.post('/v1/auth/login', formData);
            navigate('/');
        }
    }

    useEffect(() => {
        const loginData = location.state as LoginFormData;
        if (loginData) {
            setFormData(loginData);
        }
    }, []);

    return (
        <>
            <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
                <form className='flex flex-col gap-4 p-4 w-2/3 md:w-1/4' onSubmit={handleSubmit} noValidate>
                    <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                    <h1 className='text-3xl font-semibold text-black text-center'>Login</h1>
                    <Input 
                        label='Username'
                        name='username'
                        type='text'
                        required
                        onChange={handleInputChange}
                    />
                    <Input
                        label='Password'
                        name='password'
                        type='password'
                        minLength={4}
                        onChange={handleInputChange}
                    />
                    <Button color='primary' type='submit'>Login</Button>
                    {/* <HR className='my-0'/> */}
                    <Button as={Link} color='secondary' href='/register'>Register</Button>
                    <Button as={Link} href='/forgot-password' isDisabled>Forgot password</Button>
                    <div className='self-center mt-12'>&copy; 2023-2024 ForUS</div>
                </form>
            </div>
            <Popover showArrow>
                <PopoverTrigger>
                    <Button color='primary' variant='ghost' className='rounded-none absolute top-0 left-0'>Show demo credentials</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="p-4">
                        <div><span className='font-bold'>{"Username: "}</span>superman</div>
                        <div><span className='font-bold'>{"Password: "}</span>1234</div>
                    </div>  
                </PopoverContent>
            </Popover>
        </>
    );
}
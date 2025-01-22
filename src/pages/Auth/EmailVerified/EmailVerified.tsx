import { Button, Link, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataState } from "../../../models/data-state";
import { api } from "../../../api";

export function EmailVerified() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<DataState>('loading');

    useEffect(() => {
        setState('loading');
        const token = searchParams.get('token');
        if (!token) {
            setState('error');
        } else {
            // verify email
            api.post('/v1/auth/verify_email', { token }).then(() => {
                setState('idle');
                // set 5 seconds timer to navigate to login page
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }).catch(() => {
                setState('error');
            });
        }
    }, [searchParams]);

    return (
        <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
            <div className='flex flex-col gap-4 p-4 w-2/3 sm:w-1/3 md:w-1/4  text-sm'>
                <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                {state === 'loading' ? <Spinner color="secondary" /> : <>
                    <div className="text-justify">
                        {state === 'error' ?
                        'An error occurred while verifying your email.' :
                        'Your email has been verified successfully. You will be redirected to the login page in 5 seconds.'
                        }
                    </div>
                    <Button className="place-self-center" href='/login' as={Link}> Go to login page</Button>
                </>}
            </div>
        </div>
    );
}
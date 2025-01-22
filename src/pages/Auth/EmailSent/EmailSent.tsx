import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button, Link } from "@heroui/react";
import { useEffect } from "react";
import { useLocation, Location, useNavigate } from "react-router-dom";

interface EmailSentState {
    address: string;
}

export function EmailSent() {
    const navigate = useNavigate();
    const location = useLocation() as Location<EmailSentState>;

    useEffect(() => {
        if (!location.state) {
            navigate('/403');
        }
    }, [location.state]);

    return (
        location.state && <div className='flex items-center md:justify-center gap-y-8 md:gap-x-24 flex-col md:flex-row my-4'>
            <div className='flex flex-col gap-4 p-4 w-2/3 sm:w-1/3 md:w-1/4  text-sm'>
                <img src='/assets/logo.svg' className='w-2/3 self-center' alt='logo'/>
                <div>
                    An email has been sent to <span className='font-semibold'>{location.state.address}</span>.
                </div>
                <div className="text-justify">
                    In case you couldn't receive the email, please check your spam folder. Please contact the following address otherwise:
                </div>
                <Link isBlock className="place-self-center" href='mailto:minhvip08@gmail.com'>minhvip08@gmail.com</Link>
                <div className="flex flex-col justify-evenly md:flex-row gap-4">
                    <Button color="secondary" onPress={() => navigate(-1)}><ArrowLeftIcon className="size-4 inline place-self-center mr-2"/> Go back</Button>
                    <Button href='/login' as={Link}> Go to login page</Button>
                </div>
            </div>
        </div>
    );
}
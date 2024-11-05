import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/solid";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center font-bold">
            <div className="text-7xl">404</div>
            <div className="text-2xl">Page not found</div>
            <div className="mt-4 flex flex-col md:flex-row gap-4">
                <Button color="secondary" onClick={() => navigate(-1)}><ArrowLeftIcon className="size-4 inline place-self-center mr-2"/> Go back</Button>
                <Button color="gray" onClick={() => navigate('/')}><HomeIcon className="size-4 inline place-self-center mr-2"/> Return home</Button>
            </div>
        </div>
    );
}
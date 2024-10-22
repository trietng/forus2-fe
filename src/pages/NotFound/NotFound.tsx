import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center font-bold">
            <div className="text-7xl">404</div>
            <div className="text-2xl">Page not found</div>
            <Button className="mt-4" color="warning" onClick={() => navigate('/')}>Return home</Button>
        </div>
    );
}
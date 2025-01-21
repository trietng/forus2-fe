import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/solid";
import { Link, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
    navigationBar?: boolean;
}

export function NotFound(props: NotFoundProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center font-bold">
            <div className="text-7xl">404</div>
            <div className="text-2xl">Page not found</div>
            {(props.navigationBar !== false) && <div className="mt-4 flex flex-col md:flex-row gap-4">
                <Button color="secondary" onPress={() => navigate(-1)}><ArrowLeftIcon className="size-4 inline place-self-center mr-2"/> Go back</Button>
                <Button href='/' as={Link}><HomeIcon className="size-4 inline place-self-center mr-2"/> Return home</Button>
            </div>}
        </div>
    );
}
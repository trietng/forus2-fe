import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/solid";
import { Link, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
    navigationBar?: boolean;
    code: number;
    message: string;
    hideGoBack?: boolean;
}

export function ErrorPage(props: ErrorPageProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center font-bold">
            <div className="text-7xl">{props.code}</div>
            <div className="text-2xl">{props.message}</div>
            {(props.navigationBar !== false) && <div className="mt-4 flex flex-col md:flex-row gap-4">
                {props.hideGoBack !== true && <Button color="secondary" onPress={() => navigate(-1)}><ArrowLeftIcon className="size-4 inline place-self-center mr-2"/> Go back</Button>}
                <Button href='/' as={Link}><HomeIcon className="size-4 inline place-self-center mr-2"/> Return home</Button>
            </div>}
        </div>
    );
}
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { Breadcrumb } from "flowbite-react";
import { capitalize } from "../../utils/string";

interface ForusBreadcrumbUrl {
    label: string;
    link: string;
    disabled?: boolean;
}

interface ForusBreadcrumbProps {
    urls: ForusBreadcrumbUrl[];
}

export function ForusBreadcrumb(props: ForusBreadcrumbProps) {
    return (
        <Breadcrumb>
            <Breadcrumb.Item href="/all" icon={BuildingLibraryIcon}>
                All
            </Breadcrumb.Item>
            {props.urls.map(({ label, link, disabled }, index) => {
                // get the previous values and add the current value
                return (
                    <Breadcrumb.Item 
                        key={index}
                        href={link}
                        className={disabled ? "[&_a]:text-white [&_a]:pointer-events-none" : undefined}
                    >
                        {capitalize(label)}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
}
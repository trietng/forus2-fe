import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
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
        <Breadcrumbs className="[&_a]:!text-white [&_span]:!text-white">
            <BreadcrumbItem href="/all" key={0}>
                <BuildingLibraryIcon className="size-4 mr-2"/>
                All
            </BreadcrumbItem>
            {props.urls.map(({ label, link, disabled }, index) => {
                return (
                    <BreadcrumbItem 
                        key={index + 1}
                        href={link}
                        isDisabled={disabled}
                    >
                        {capitalize(label)}
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumbs>
    );
}
import { Button, Link } from "@heroui/react";
import { PropsWithChildren } from "react";

interface ResponsiveLinkProps extends PropsWithChildren {
    href: string;
    className?: string;
}

export function ResponsiveLink(props: ResponsiveLinkProps) {
    return (
        <>
            <Link isBlock href={props.href} className={"font-semibold hidden md:block " + (props.className ? props.className : "")}>{props.children}</Link>
            <Button variant="ghost" as={Link} href={props.href} className={"md:hidden justify-start " + (props.className ? props.className : "")}>{props.children}</Button>
        </>
    )
}
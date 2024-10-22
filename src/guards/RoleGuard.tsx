import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../models/role";
import { getDecodedPayload } from "../helpers/jwt";

interface RouteGuardProps {
    children: ReactNode;
    roles: UserRole[];
}

export function RoleGuard(props: RouteGuardProps) {
    const payload = getDecodedPayload();
    if (payload && props.roles.includes(payload.role)) {
        return props.children;
    }
    return <Navigate to='/403'/>;
}
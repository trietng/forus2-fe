import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthGuardProps {
    children: ReactNode;
    reverse?: boolean;
}

export function AuthGuard(props: AuthGuardProps) {
    // DEBUG;
    return props.children;
    // TEMP DISABLED
    // const headerPayload = Cookies.get('headerPayload');
    // let children;
    // let redirection;
    // if (props.reverse) {
    //     redirection = props.children;
    //     children = <Navigate to='/' />;
    // }
    // else {
    //     redirection = <Navigate to='/login' />;
    //     children = props.children;
    // }
    // if (headerPayload) {
    //     const decoded = jwtDecode(headerPayload);
    //     if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
    //         return children;
    //     }
    // }
    // return redirection;
}
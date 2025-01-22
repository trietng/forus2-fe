import { Outlet } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "./simple.css";

interface AuthLayoutProps {
    className?: string;
}

export function AuthLayout(props: AuthLayoutProps) {
    return (
        <div>
            <div className={'min-h-screen flex flex-col antialiased' + (props.className ? ' ' + props.className : '')}>
                <div className='my-auto'>
                    <Outlet />
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}
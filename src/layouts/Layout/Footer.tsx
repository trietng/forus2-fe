import { EnvelopeIcon } from "@heroicons/react/24/solid";


export function Footer() {
    return (
        <footer className="bg-primary border-t mt-5">
        <div className="container mx-auto">
            <div className="flex flex-wrap p-4">
            <div className="w-full md:w-1/3 mb-5 flex">
                <img src="/assets/logo.svg" alt="logo" className="w-36" />
            </div>

            <div className="w-full md:w-1/3 mb-5"></div>

            <div className="w-full md:w-1/3 mb-5">
                <h5 className="text-white text-left">Contact Us</h5>
                <ul className="space-y-2 mt-3">
                    <li className="flex items-center text-white">
                        <EnvelopeIcon className="size-4" />
                        <a href="mailto:trietnguyen0781@gmail.com" className="px-2">trietnguyen0781@gmail.com</a>
                    </li>
                    <li className="flex items-center text-white">
                        <EnvelopeIcon className="size-4" />
                        <a href="mailto:hch22092000@gmail.com" className="px-2">hch22092000@gmail.com</a>
                    </li>
                </ul>
            </div>

            <p className="w-full text-white text-center mt-3">©2024 Made with ❤️</p>
            </div>
        </div>
        </footer>
    );
}
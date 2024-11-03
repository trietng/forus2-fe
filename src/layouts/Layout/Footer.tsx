import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { HR } from "flowbite-react";


export function Footer() {
    return (
        <footer className="bg-primary mt-5">
            <div className="container mx-auto">
                <div className="flex flex-wrap px-4 pt-8 pb-4">
                    <div className="w-full md:w-1/3 mb-5">
                        <img src="/assets/logo.svg" alt="logo" className="w-36" />
                        <HR className="my-4" />
                        <div className="text-sm">
                            <p>Powered by</p>
                            <a className="inline-block mt-2 h-8 w-[106px] bg-[url('/assets/third-party/react/wordmark_dark.svg')] bg-contain" href="https://react.dev"></a>
                            <a className="inline-block ml-[43.75px]" href="https://fastify.dev">
                                <img src="/assets/third-party/fastify/fastify-white-landscape.svg" alt="fastify" className="h-8" />
                            </a>
                            <a className="block my-2 h-8 w-[254px] bg-[url('/assets/third-party/tailwindcss/tailwindcss-logotype-white.svg')] bg-contain" href="https://tailwindcss.com"></a>
                            <p>React brand logo &copy; React team, <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
                        </div>
                    </div>
                    {/* Intentionally left empty */}
                    <div className="w-full md:w-1/3 mb-5"></div>

                    <div className="w-full md:w-1/3 mb-5">
                        <div className="text-left font-bold text-lg">Contact Us</div>
                        <ul className="space-y-2 mt-3">
                            <li className="flex items-center text-white">
                                <EnvelopeIcon className="size-4" />
                                <a href="mailto:trietnguyen0781@gmail.com" className="px-2">trietnguyen0781@gmail.com</a>
                            </li>
                            <li className="flex items-center text-white">
                                <EnvelopeIcon className="size-4" />
                                <a href="mailto:minhvip08@gmail.com" className="px-2">minhvip08@gmail.com</a>
                            </li>
                            <li className="flex items-center text-white">
                                <EnvelopeIcon className="size-4" />
                                <a href="mailto:nxhoa21@apcs.fitus.edu.vn" className="px-2">nxhoa21@apcs.fitus.edu.vn</a>
                            </li>
                            <li className="flex items-center text-white">
                                <EnvelopeIcon className="size-4" />
                                <a href="mailto:htkha21@apcs.fitus.edu.vn" className="px-2">htkha21@apcs.fitus.edu.vn</a>
                            </li>
                            <li className="flex items-center text-white">
                                <EnvelopeIcon className="size-4" />
                                <a href="mailto:ntphung21@apcs.fitus.edu.vn" className="px-2">ntphung21@apcs.fitus.edu.vn</a>
                            </li>
                        </ul>
                    </div>

                    <p className="w-full text-white text-center mt-3">©2024 Made with ❤️</p>
                </div>
            </div>
        </footer>
    );
}
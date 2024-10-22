

export function Footer() {
    return (
        <footer className="bg-primary border-t mt-5">
        <div className="container mx-auto">
            <div className="flex flex-wrap py-4">
            <div className="w-full md:w-1/3 mb-5">
                {/* <img src={logo} alt="logo" className="h-36" /> */}

                <p className="text-white text-left mt-3 ml-5">
                This is a sample forum for Project CS434. If you’re interested in using it for your own purposes, please feel free to ask us.
                </p>
            </div>

            <div className="w-full md:w-1/3 mb-3"></div>

            <div className="w-full md:w-1/3 mb-5">
                <h5 className="text-white text-left">Contact Us</h5>
                <ul className="space-y-2 mt-3">
                <li className="flex items-center text-warning">
                    {/* <EmailIcon className="text-white large" /> */}
                    <a href="mailto:nsminh21@apcs.fitus.edu.vn" className="text-white px-2">nsminh21@apcs.fitus.edu.vn</a>
                </li>
                <li className="flex items-center text-warning">
                    {/* <EmailIcon className="text-white large" /> */}
                    <a href="mailto:ndtriet21@apcs.fitus.edu.vn" className="text-white px-2">ndtriet21@apcs.fitus.edu.vn</a>
                </li>
                <li className="flex items-center text-warning">
                    {/* <EmailIcon className="text-white large" /> */}
                    <a href="mailto:vqvtung21@apcs.fitus.edu.vn" className="text-white px-2">vqvtung21@apcs.fitus.edu.vn</a>
                </li>
                <li className="flex items-center text-warning">
                    {/* <EmailIcon className="text-white large" /> */}
                    <a href="mailto:qplong21@apcs.fitus.edu.vn" className="text-white px-2">qplong21@apcs.fitus.edu.vn</a>
                </li>
                </ul>
            </div>

            <p className="w-full text-white text-center mt-3">©2024 Made with ❤️</p>
            </div>
        </div>
        </footer>
    );
}
import { Groups } from "./Groups/Groups";

export function Home() {
    return (
        <div className="w-full my-8 grid md:grid-cols-12 gap-4">
            <div className="col-span-8">
                <Groups />
            </div>
            <div className="col-span-4">
                <h1>Notifications</h1>
            </div>
        </div>
    );
}
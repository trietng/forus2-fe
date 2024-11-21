import { useParams } from "react-router-dom";
import Profile from "../Settings/Profile";

export function User() {
    const params = useParams();
    
    return (
        <div className="w-full py-4 my-8 bg-body-secondary rounded-lg">
            <Profile mode="view" id={params.id}/>
        </div>
    );
}
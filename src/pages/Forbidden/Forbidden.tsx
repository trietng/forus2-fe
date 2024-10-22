import { useNavigate } from "react-router-dom";

export function Forbidden() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center font-bold">
            <div className="text-7xl text-white">403</div>
            <div className="text-2xl text-white">Forbidden</div>
            <button className="mt-4 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400" onClick={() => navigate('/')}>Return home</button>
        </div>
    );
}
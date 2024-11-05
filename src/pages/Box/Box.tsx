import { useLayoutEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { api } from "../../api";
import { $box } from "../../models/box";

function route(id: string, page: number, order: string | null = null, direction: string | null = null) {
    const url = isNaN(page) ? `/box/${id}` : `/box/${id}/${page}`;
    if (order && direction) {
        return `${url}?order=${order}&direction=${direction}`;
    }
    return url;
}

export function Box() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const box = useStore($box);
    
    const order = searchParams.get('order');
    const direction = searchParams.get('direction');
    const page = Number.parseInt(params.page || '');

    useLayoutEffect(() => {
        if (params.id == null) {
            navigate('/404', { replace: true });
        }
        else {
            // NAND check
            if (page <= 1) {
                navigate(route(params.id, NaN, order, direction), { replace: true });
            }
            if ((Boolean(order) && !Boolean(direction)) || (!Boolean(order) && Boolean(direction))) {
                navigate(route(params.id, page), { replace: true });
            }
        }
    }, []);

    async function fetchBox() {
        const response = await api.get(`/box/${params.id}`);
        $box.set(response.data);
    }

    return (
        <div>
            Box
        </div>
    );
}
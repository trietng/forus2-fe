import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { api } from "../../api";
import { $box } from "../../models/box";
import { nand } from "../../utils/boolean";
import { ForusBreadcrumb } from "../../components/Routing/ForusBreadcrumb";
import { BoxInformation } from "../../components/Control/Box";

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
    
    async function fetchBox() {
        const notNaNNumber = isNaN(page) ? 1 : page;
        console.log(params.id);
        try {
            const response = await api.get(`v1/boxes/${params.id}/${notNaNNumber}`);
            $box.set(response.data);
        }
        catch (error: any) {
            if (error.response?.status === 404) {
                navigate('/404', { replace: true });
            }
        };
    }

    useLayoutEffect(() => {
        if (params.id == null) {
            navigate('/404', { replace: true });
        }
        else {
            // NAND check
            if (page <= 1) {
                navigate(route(params.id, NaN, order, direction), { replace: true });
            }
            if (nand(order, direction)) {
                navigate(route(params.id, page), { replace: true });
            }
        }
    }, []);

    useEffect(() => {
        fetchBox();
    }, []);

    return (
        <>
            {box && <ForusBreadcrumb urls={[
                { label: box.group?.name || 'Group', link: box.group?.name ? `/all#${box.group?._id}` : '' },
                { label: box.name, link: `/box/${box._id}` }
            ]} />}
            <div className="md:hidden mt-4">
                <BoxInformation />
            </div>
        </>
    );
}
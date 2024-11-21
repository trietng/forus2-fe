import { useEffect, useLayoutEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { api } from "../../api";
import { $box } from "../../models/box";
import { nand } from "../../utils/boolean";
import { ForusBreadcrumb } from "../../components/Routing/ForusBreadcrumb";
import { BoxInformation, route, ThreadFilter } from "../../components/Control/Box";
import { ThreadEditor } from "../../components/Control/Thread";
import { BoxModal } from "../../components/Modal/Box";
import { ThreadPreviewCard } from "../../components/ThreadPreviewCard";
import { Pagination } from "flowbite-react";



export function Box() {
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const box = useStore($box);
    
    const order = searchParams.get('order');
    const direction = searchParams.get('direction');
    const page = Number.parseInt(params.page || '1');
    
    async function fetchBox() {
        try {
            let response;
            if (order && direction) {
                response = await api.get(`v1/boxes/${params.id}/${page}?order=${order}&direction=${direction}`);
            } else {
                response = await api.get(`v1/boxes/${params.id}/${page}`);
            }
            $box.set(response.data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                navigate('/404', { replace: true });
            }
        };
    }

    function handlePageChange(page: number) {
        navigate(route(params.id!, page, order, direction));
    }

    function handleFilter(order: string, direction: string) {
        navigate(route(params.id!, page, order, direction));
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
    }, [params.id, page, order, direction]);

    if (!box) {
        return null;
    }

    return (
        <>
            <ForusBreadcrumb urls={[
                { label: box.group?.name || 'Group', link: box.group?.name ? `/all#${box.group?._id}` : '' },
                { label: box.name, link: `/box/${box._id}` }
            ]}/>
            <div className="md:hidden mt-4">
                <BoxInformation />
            </div>
            <div className="mt-4 flex justify-between">
                {(box.pageCount || 1) > 1 ? 
                <Pagination showIcons currentPage={page} onPageChange={(p) => handlePageChange(p)} totalPages={box.pageCount || 0}/> :
                <div></div>}
                <ThreadFilter order={order} direction={direction} onApplyFilter={(order, direction) => handleFilter(order, direction)}/>
            </div>
            {box.threads?.map(thread => (
                <div key={thread._id} className="mt-4">
                    <ThreadPreviewCard thread={thread} />
                </div>
            ))}
            <div className="mt-4">
                <ThreadEditor mode="create" />
            </div>
            <BoxModal />
        </>
    );
}
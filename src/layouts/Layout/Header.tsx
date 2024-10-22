import { useEffect, useState } from 'react';
import { Logo } from '../../components/Logo';

export function Header() {
    let [isOpaque, setIsOpaque] = useState(false);

    useEffect(() => {
        let offset = 50

        function onScroll() {
            if (!isOpaque && window.scrollY > offset) {
                setIsOpaque(true)
            } else if (isOpaque && window.scrollY <= offset) {
                setIsOpaque(false)
            }
        }

        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [isOpaque])

    return (
        <header
            className={
                'sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b border-slate-50/[0.06] ' + (isOpaque
                    ? 'supports-backdrop-blur:bg-white/95 bg-slate-900/75'
                    : 'supports-backdrop-blur:bg-white/60 bg-transparent')
            }>
            <div className='max-w-8xl mx-auto'>
                <div className='py-4 border-b lg:px-8 lg:border-0 border-slate-300/10 mx-4 lg:mx-0'>
                    <div className='flex justify-between'>
                        <div className='flex justify-start gap-4 items-end'>
                            <Logo />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
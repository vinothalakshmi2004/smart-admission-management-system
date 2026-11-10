import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Start every new page at the top (React Router keeps the old scroll position otherwise)
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);
    return null;
};

export default ScrollToTop;

import React, { Suspense } from 'react';
import { Loading } from '../components/AnimationComponents';

// Lazy load components with custom loading states
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ReactNode
) => {
    const LazyComponent = React.lazy(importFunc);

    return (props: React.ComponentProps<T>) => (
        <Suspense fallback={fallback || <Loading size="lg" text="Loading..." type="dots" />}>
            <LazyComponent {...props} />
        </Suspense>
    );
};

// Preload a lazy component
export const preloadComponent = (importFunc: () => Promise<any>) => {
    importFunc();
};

// Lazy load with retry logic
export const lazyWithRetry = <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    retries: number = 3
): React.LazyExoticComponent<T> => {
    return React.lazy(async () => {
        for (let i = 0; i < retries; i++) {
            try {
                return await importFunc();
            } catch (error) {
                if (i === retries - 1) throw error;
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
        throw new Error('Failed to load component');
    });
};

// Code splitting by route
export const RouteBasedLazyLoad = {
    // Auth screens
    AuthScreens: lazyWithRetry(() =>
        import('../components/Auth').then(m => ({ default: m.AuthScreens }))
    ),

    // Client screens
    ClientScreens: lazyWithRetry(() =>
        import('../components/Client').then(m => ({ default: m.ClientScreens }))
    ),

    // Washer screens
    WasherScreens: lazyWithRetry(() =>
        import('../components/Washer').then(m => ({ default: m.WasherScreens }))
    ),

    // Admin screens
    AdminPanel: lazyWithRetry(() =>
        import('../components/AdminPanel').then(m => ({ default: m.AdminScreens }))
    ),

    // Washer registration
    WasherRegistration: lazyWithRetry(() =>
        import('../components/WasherRegistration').then(m => ({ default: m.WasherRegistration }))
    )
};

// Lazy load heavy libraries
export const LazyLibraries = {
    // Google Maps
    GoogleMapsLoader: lazyWithRetry(() =>
        import('@react-google-maps/api').then(m => ({ default: m.LoadScript }))
    ),

    // Charts (if using recharts)
    // Charts: lazyWithRetry(() =>
    //    import('recharts').then(m => ({ default: m }))
    // )
};

// Component-level code splitting
export const LazyComponents = {
    // Map component
    // Map: lazyLoadComponent(
    //    () => import('../components/Map'),
    //    <div className="w-full h-full flex items-center justify-center bg-slate-800">
    //        <Loading text="Loading map..." />
    //    </div>
    // ),

    // Chat component
    // Chat: lazyLoadComponent(
    //    () => import('../components/Chat'),
    //    <div className="flex items-center justify-center p-8">
    //        <Loading text="Loading chat..." />
    //    </div>
    // ),

    // Image gallery
    ImageGallery: lazyLoadComponent(
        () => import('../components/OptimizedImage').then(m => ({ default: m.ImageGallery })),
        <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton h-48 rounded-lg" />
            ))}
        </div>
    )
};

// Intersection Observer based lazy loading
interface LazyOnViewProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
}

export const LazyOnView: React.FC<LazyOnViewProps> = ({
    children,
    fallback = <Loading />,
    rootMargin = '100px',
    threshold = 0.1
}) => {
    const [isInView, setIsInView] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin, threshold }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [rootMargin, threshold]);

    return (
        <div ref={ref}>
            {isInView ? children : fallback}
        </div>
    );
};

// Prefetch on hover
export const usePrefetch = (importFunc: () => Promise<any>) => {
    const [isPrefetched, setIsPrefetched] = React.useState(false);

    const prefetch = React.useCallback(() => {
        if (!isPrefetched) {
            importFunc();
            setIsPrefetched(true);
        }
    }, [importFunc, isPrefetched]);

    return {
        onMouseEnter: prefetch,
        onTouchStart: prefetch
    };
};

// Bundle analyzer helper (development only)
export const logBundleSize = (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Bundle] Loading ${componentName}`);
    }
};

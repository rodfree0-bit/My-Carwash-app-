import React, { useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

interface SwipeableScreenProps {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    enableSwipe?: boolean;
}

export const SwipeableScreen: React.FC<SwipeableScreenProps> = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    enableSwipe = true
}) => {
    const handlers = useSwipeable({
        onSwipedLeft: () => enableSwipe && onSwipeLeft?.(),
        onSwipedRight: () => enableSwipe && onSwipeRight?.(),
        onSwipedUp: () => enableSwipe && onSwipeUp?.(),
        onSwipedDown: () => enableSwipe && onSwipeDown?.(),
        preventScrollOnSwipe: false,
        trackMouse: false,
        delta: 50 // Minimum distance for swipe
    });

    return (
        <div {...handlers} style={{ width: '100%', height: '100%' }}>
            {children}
        </div>
    );
};

interface PullToRefreshProps {
    children: React.ReactNode;
    onRefresh: () => Promise<void>;
    threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
    children,
    onRefresh,
    threshold = 80
}) => {
    const [pullDistance, setPullDistance] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [canPull, setCanPull] = React.useState(false);
    const startY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const scrollTop = containerRef.current?.scrollTop || 0;
        if (scrollTop === 0) {
            setCanPull(true);
            startY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!canPull || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY.current;

        if (distance > 0) {
            setPullDistance(Math.min(distance, threshold * 1.5));
        }
    };

    const handleTouchEnd = async () => {
        if (!canPull || isRefreshing) return;

        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
        setCanPull(false);
    };

    const pullProgress = Math.min((pullDistance / threshold) * 100, 100);
    const rotation = (pullProgress / 100) * 360;

    return (
        <div
            ref={containerRef}
            className="relative overflow-y-auto h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull indicator */}
            <div
                className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50"
                style={{
                    height: `${pullDistance}px`,
                    opacity: pullDistance > 0 ? 1 : 0
                }}
            >
                <div
                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isRefreshing ? 'none' : 'transform 0.2s'
                    }}
                />
            </div>

            {/* Refreshing indicator */}
            {isRefreshing && (
                <div className="absolute top-4 left-0 right-0 flex items-center justify-center z-50">
                    <div className="spinner-sm" />
                </div>
            )}

            {/* Content */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: pullDistance === 0 ? 'transform 0.3s' : 'none'
                }}
            >
                {children}
            </div>
        </div>
    );
};

interface SwipeableModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export const SwipeableModal: React.FC<SwipeableModalProps> = ({
    isOpen,
    onClose,
    children,
    title
}) => {
    const [translateY, setTranslateY] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const startY = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY.current;

        if (distance > 0) {
            setTranslateY(distance);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        if (translateY > 100) {
            onClose();
        }
        setTranslateY(0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 modal-backdrop-enter"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full bg-surface-dark rounded-t-3xl max-h-[90vh] flex flex-col modal-content-enter"
                style={{
                    transform: `translateY(${translateY}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>

                {/* Title */}
                {title && (
                    <div className="px-6 py-4 border-b border-white/10">
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface SwipeableTabsProps {
    tabs: { id: string; label: string; content: React.ReactNode }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({
    tabs,
    activeTab,
    onTabChange
}) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    const handleSwipeLeft = () => {
        if (currentIndex < tabs.length - 1) {
            onTabChange(tabs[currentIndex + 1].id);
        }
    };

    const handleSwipeRight = () => {
        if (currentIndex > 0) {
            onTabChange(tabs[currentIndex - 1].id);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Tab headers */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              px-6 py-3 font-semibold whitespace-nowrap transition-all
              ${activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-slate-400 hover:text-white'
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content with swipe */}
            <SwipeableScreen
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
            >
                <div className="flex-1 overflow-y-auto">
                    {tabs.find(tab => tab.id === activeTab)?.content}
                </div>
            </SwipeableScreen>
        </div>
    );
};

// Long press gesture hook
export const useLongPress = (
    callback: () => void,
    duration: number = 500
) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const target = useRef<EventTarget | null>(null);

    const start = (e: React.TouchEvent | React.MouseEvent) => {
        target.current = e.target;
        timeout.current = setTimeout(() => {
            callback();
        }, duration);
    };

    const clear = () => {
        timeout.current && clearTimeout(timeout.current);
    };

    return {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear
    };
};

// Double tap gesture hook
export const useDoubleTap = (
    callback: () => void,
    delay: number = 300
) => {
    const lastTap = useRef(0);

    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < delay) {
            callback();
        }
        lastTap.current = now;
    };

    return {
        onClick: handleTap,
        onTouchEnd: handleTap
    };
};

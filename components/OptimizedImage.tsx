import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    placeholder?: 'blur' | 'shimmer' | 'skeleton';
    priority?: boolean;
    onLoad?: () => void;
    onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    placeholder = 'shimmer',
    priority = false,
    onLoad,
    onError
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || !imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px' // Start loading 50px before image enters viewport
            }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setError(true);
        onError?.();
    };

    // Convert PNG to WebP path if available
    const getOptimizedSrc = (originalSrc: string) => {
        if (originalSrc.endsWith('.png') || originalSrc.endsWith('.jpg') || originalSrc.endsWith('.jpeg')) {
            const webpSrc = originalSrc.replace(/\.(png|jpg|jpeg)$/, '.webp');
            return webpSrc;
        }
        return originalSrc;
    };

    const optimizedSrc = getOptimizedSrc(src);

    const getPlaceholder = () => {
        switch (placeholder) {
            case 'blur':
                return (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse ${className}`}
                        style={{ width, height }}
                    />
                );
            case 'skeleton':
                return (
                    <div
                        className={`skeleton ${className}`}
                        style={{ width, height }}
                    />
                );
            case 'shimmer':
            default:
                return (
                    <div
                        className={`absolute inset-0 shimmer bg-slate-800 ${className}`}
                        style={{ width, height }}
                    />
                );
        }
    };

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-slate-800 text-slate-500 ${className}`}
                style={{ width, height }}
            >
                <span className="material-symbols-outlined text-4xl">broken_image</span>
            </div>
        );
    }

    return (
        <div className="relative" style={{ width, height }} ref={imgRef}>
            {!isLoaded && getPlaceholder()}
            {isInView && (
                <img
                    src={optimizedSrc}
                    alt={alt}
                    className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    style={{ width, height }}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                />
            )}
        </div>
    );
};

// Background image component with lazy loading
interface OptimizedBackgroundProps {
    src: string;
    className?: string;
    children?: React.ReactNode;
    overlay?: boolean;
    overlayOpacity?: number;
}

export const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
    src,
    className = '',
    children,
    overlay = false,
    overlayOpacity = 0.5
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '50px' }
        );

        observer.observe(divRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) return;

        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
    }, [isInView, src]);

    return (
        <div
            ref={divRef}
            className={`relative ${className}`}
            style={{
                backgroundImage: isLoaded ? `url(${src})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.3s'
            }}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer bg-slate-800" />}
            {overlay && isLoaded && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

// Avatar component with fallback
interface AvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    name,
    size = 'md',
    className = ''
}) => {
    const [error, setError] = useState(false);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getColorFromName = (name: string) => {
        const colors = [
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (!src || error) {
        return (
            <div
                className={`
          ${sizeClasses[size]}
          ${getColorFromName(name)}
          rounded-full flex items-center justify-center
          font-bold text-white
          ${className}
        `}
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <OptimizedImage
            src={src}
            alt={name}
            className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            onError={() => setError(true)}
            priority
        />
    );
};

// Image gallery with lazy loading
interface ImageGalleryProps {
    images: { src: string; alt: string; caption?: string }[];
    columns?: number;
    gap?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    columns = 3,
    gap = 4
}) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    return (
        <>
            <div
                className={`grid gap-${gap}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="cursor-pointer hover-scale"
                        onClick={() => setSelectedImage(index)}
                    >
                        <OptimizedImage
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        {image.caption && (
                            <p className="text-sm text-slate-400 mt-2">{image.caption}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:opacity-70"
                        onClick={() => setSelectedImage(null)}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <OptimizedImage
                        src={images[selectedImage].src}
                        alt={images[selectedImage].alt}
                        className="max-w-full max-h-full object-contain"
                        priority
                    />
                    {images[selectedImage].caption && (
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white text-lg">
                            {images[selectedImage].caption}
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

// Progressive image loader
interface ProgressiveImageProps {
    lowQualitySrc: string;
    highQualitySrc: string;
    alt: string;
    className?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    lowQualitySrc,
    highQualitySrc,
    alt,
    className = ''
}) => {
    const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

    return (
        <div className="relative">
            <img
                src={lowQualitySrc}
                alt={alt}
                className={`${className} ${isHighQualityLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 blur-sm`}
            />
            <img
                src={highQualitySrc}
                alt={alt}
                className={`${className} ${isHighQualityLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 absolute inset-0`}
                onLoad={() => setIsHighQualityLoaded(true)}
                loading="lazy"
            />
        </div>
    );
};

import React, { useState, useRef, useEffect } from 'react';
import { storage } from '../../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

interface PhotoCaptureProps {
    onPhotosComplete: (photos: { [key: string]: string }) => void;
    onCancel: () => void;
    mode: 'before' | 'after';
    orderId: string;
}

const CarIcon = ({ type }: { type: string }) => {
    const iconColor = "#3b82f6";
    const strokeWidth = "1.5";

    switch (type) {
        case 'front':
            return (
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <g stroke={iconColor} strokeWidth={strokeWidth} fill="none">
                        <path d="M20,60 L25,45 L30,35 L70,35 L75,45 L80,60 L80,75 L20,75 Z" />
                        <path d="M32,45 L35,35 L65,35 L68,45" />
                        <circle cx="30" cy="75" r="8" />
                        <circle cx="70" cy="75" r="8" />
                        <rect x="25" y="58" width="8" height="4" rx="1" />
                        <rect x="67" y="58" width="8" height="4" rx="1" />
                    </g>
                </svg>
            );
        case 'back':
            return (
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <g stroke={iconColor} strokeWidth={strokeWidth} fill="none">
                        <path d="M20,60 L25,45 L30,35 L70,35 L75,45 L80,60 L80,75 L20,75 Z" />
                        <path d="M32,45 L35,35 L65,35 L68,45" />
                        <circle cx="30" cy="75" r="8" />
                        <circle cx="70" cy="75" r="8" />
                        <rect x="25" y="58" width="8" height="6" rx="1" />
                        <rect x="67" y="58" width="8" height="6" rx="1" />
                        <rect x="42" y="60" width="16" height="6" rx="1" />
                    </g>
                </svg>
            );
        case 'leftSide':
            return (
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <g stroke={iconColor} strokeWidth={strokeWidth} fill="none">
                        <path d="M15,65 L20,50 L25,40 L35,35 L55,35 L65,40 L75,45 L85,65 L85,75 L15,75 Z" />
                        <path d="M28,45 L35,38 L50,38 L55,42" />
                        <path d="M58,42 L63,38 L72,42" />
                        <circle cx="30" cy="75" r="8" />
                        <circle cx="70" cy="75" r="8" />
                        <line x1="52" y1="42" x2="52" y2="75" />
                    </g>
                </svg>
            );
        case 'rightSide':
            return (
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <g stroke={iconColor} strokeWidth={strokeWidth} fill="none">
                        <path d="M85,65 L80,50 L75,40 L65,35 L45,35 L35,40 L25,45 L15,65 L15,75 L85,75 Z" />
                        <path d="M72,45 L65,38 L50,38 L45,42" />
                        <path d="M42,42 L37,38 L28,42" />
                        <circle cx="70" cy="75" r="8" />
                        <circle cx="30" cy="75" r="8" />
                        <line x1="48" y1="42" x2="48" y2="75" />
                    </g>
                </svg>
            );
        case 'interiorFront':
            return (
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <g stroke={iconColor} strokeWidth={strokeWidth} fill="none">
                        <rect x="20" y="45" width="20" height="30" rx="2" />
                        <rect x="20" y="35" width="20" height="12" rx="2" />
                        <rect x="60" y="45" width="20" height="30" rx="2" />
                        <rect x="60" y="35" width="20" height="12" rx="2" />
                        <path d="M15,80 L85,80" />
                        <circle cx="50" cy="85" r="3" />
                    </g>
                </svg>
            );
        case 'interiorBack':
            return (
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <g stroke={iconColor} strokeWidth={strokeWidth} fill="none">
                        <rect x="15" y="45" width="70" height="30" rx="2" />
                        <rect x="15" y="35" width="70" height="12" rx="2" />
                        <line x1="38" y1="45" x2="38" y2="75" />
                        <line x1="62" y1="45" x2="62" y2="75" />
                        <circle cx="27" cy="30" r="3" />
                        <circle cx="50" cy="30" r="3" />
                        <circle cx="73" cy="30" r="3" />
                    </g>
                </svg>
            );
        default:
            return null;
    }
};

const REQUIRED_PHOTOS = [
    { key: 'front', label: 'Front View' },
    { key: 'back', label: 'Back View' },
    { key: 'leftSide', label: 'Left Side' },
    { key: 'rightSide', label: 'Right Side' },
    { key: 'interiorFront', label: 'Interior Front' },
    { key: 'interiorBack', label: 'Interior Back' },
];

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotosComplete, onCancel, mode, orderId }) => {
    const [photos, setPhotos] = useState<{ [key: string]: string }>({});
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [capturingKey, setCapturingKey] = useState<string>('');
    const [isWeb, setIsWeb] = useState(true); // Default to web for safety

    // Detect if running on web
    useEffect(() => {
        const checkPlatform = () => {
            try {
                // Check if we're in a Capacitor environment
                const isCapacitor = !!(window as any).Capacitor;
                if (isCapacitor) {
                    const platform = (window as any).Capacitor?.getPlatform?.();
                    console.log('DEBUG: PhotoCapture Platform Detection (Capacitor):', platform);
                    setIsWeb(platform === 'web');
                } else {
                    console.log('DEBUG: PhotoCapture Platform Detection: No Capacitor found, assuming web');
                    setIsWeb(true); // No Capacitor = web
                }
            } catch (error) {
                console.log('DEBUG: Platform detection defaulting to web:', error);
                setIsWeb(true); // Default to web on error
            }
        };
        checkPlatform();
    }, []);

    const handleCapture = async (key: string) => {
        setCapturingKey(key);

        // On web platform, use file input instead of Capacitor Camera
        if (isWeb) {
            console.log('DEBUG: handleCapture Web mode for key:', key);
            if (fileInputRef.current) {
                console.log('DEBUG: Triggering click on file input');
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.click();
            } else {
                console.log('DEBUG ERROR: fileInputRef.current is null!');
            }
            return;
        }

        try {
            // Import Capacitor Camera dynamically (only for native)
            const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

            const image = await Camera.getPhoto({
                quality: 60,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt,
                saveToGallery: false,
                width: 1024,
                promptLabelHeader: 'Service Photo',
                promptLabelPhoto: 'Select Source',
                promptLabelPicture: 'Take Photo'
            });

            if (image.dataUrl) {
                // Upload to Firebase Storage
                const storagePath = `orders/${orderId}/${mode}/${key}_${Date.now()}.jpg`;
                const storageRef = ref(storage, storagePath);

                await uploadString(storageRef, image.dataUrl, 'data_url');
                const downloadURL = await getDownloadURL(storageRef);

                // Save photo URL
                setPhotos(prev => ({
                    ...prev,
                    [key]: downloadURL
                }));

                setCurrentPhoto(downloadURL);
                setTimeout(() => setCurrentPhoto(null), 2000);
            }

            setCapturingKey('');
        } catch (error: any) {
            console.error('Camera error:', error);
            setCapturingKey('');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Compress image using canvas
            const compressedDataUrl = await new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    let width = img.width;
                    let height = img.height;
                    const maxSize = 800;

                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    const result = canvas.toDataURL('image/jpeg', 0.5);
                    URL.revokeObjectURL(img.src);
                    resolve(result);
                };
                img.onerror = (err) => {
                    console.error('Image load error:', err);
                    reject(new Error('Failed to load image for compression'));
                };
                img.src = URL.createObjectURL(file);
            });

            // Upload to Firebase Storage
            const storagePath = `orders/${orderId}/${mode}/${capturingKey}_${Date.now()}.jpg`;
            const storageRef = ref(storage, storagePath);

            await uploadString(storageRef, compressedDataUrl, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);

            setPhotos(prev => ({ ...prev, [capturingKey]: downloadURL }));
            setCurrentPhoto(downloadURL);
            setTimeout(() => setCurrentPhoto(null), 2000);
        } catch (error) {
            console.error('Error compressing image:', error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleComplete = () => {
        if (Object.keys(photos).length === 6) {
            onPhotosComplete(photos);
        }
    };

    const progress = Object.keys(photos).length;
    const isComplete = progress === 6;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 safe-area-top">
                <div className="flex items-center justify-between mb-2">
                    <button onClick={onCancel} className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h2 className="text-lg font-bold">
                        {mode === 'before' ? 'Before Photos' : 'After Photos'}
                    </h2>
                    <div className="w-10"></div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">{progress} of 6 photos</span>
                        <span className="text-sm font-bold text-primary">{Math.round((progress / 6) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-500 ease-out"
                            style={{ width: `${(progress / 6) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Photo Preview (when just taken) */}
            {currentPhoto && (
                <div className="absolute inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-200">
                    <img src={currentPhoto} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Photo Saved!
                    </div>
                </div>
            )}

            {/* Photo Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-400 text-2xl">info</span>
                            <div>
                                <p className="font-bold text-blue-400 mb-1">Required Photos</p>
                                <p className="text-sm text-slate-400">
                                    Take clear photos of all 6 angles. This protects both you and the client.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {REQUIRED_PHOTOS.map((photo) => {
                            const hasPho = photos[photo.key];
                            return (
                                <button
                                    key={photo.key}
                                    onClick={() => handleCapture(photo.key)}
                                    className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${hasPho
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-white/20 bg-white/5 hover:border-primary hover:bg-primary/10'
                                        }`}
                                >
                                    {hasPho ? (
                                        <>
                                            <img
                                                src={photos[photo.key]}
                                                alt={photo.label}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="mb-2"><CarIcon type={photo.key} /></div>
                                            <span className="material-symbols-outlined text-primary text-3xl mb-2">photo_camera</span>
                                            <p className="text-xs font-bold text-center px-2">{photo.label}</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 border-t border-white/10 safe-area-bottom">
                <button
                    onClick={handleComplete}
                    disabled={!isComplete}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isComplete
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {isComplete ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            Continue ({progress}/6)
                        </span>
                    ) : (
                        <span>Take All Photos ({progress}/6)</span>
                    )}
                </button>
            </div>

            {/* Hidden File Input for Web */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
};

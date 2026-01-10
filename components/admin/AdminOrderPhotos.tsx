import React from 'react';
import { Order } from '../../types';
import { ImageGallery } from '../OptimizedImage';

interface AdminOrderPhotosProps {
    order: Order;
}

export const AdminOrderPhotos: React.FC<AdminOrderPhotosProps> = ({ order }) => {
    if (!order.photos) {
        return (
            <div className="bg-black/30 rounded-lg p-6 text-center border border-white/10">
                <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">no_photography</span>
                <p className="text-sm text-slate-500">No hay fotos disponibles para este pedido</p>
            </div>
        );
    }

    const { before, after } = order.photos;

    const formatPhotos = (photosData: any) => {
        if (!photosData) return [];

        if (Array.isArray(photosData)) {
            return photosData.map((src, idx) => ({
                src,
                alt: `Foto ${idx + 1}`,
                caption: getLabelForIndex(idx)
            })).filter(p => p.src);
        }

        if (typeof photosData === 'object') {
            const labelMap: Record<string, string> = {
                front: 'Frente',
                back: 'Atrás',
                leftSide: 'Lateral Izq.',
                rightSide: 'Lateral Der.',
                interiorFront: 'Interior Frente',
                interiorBack: 'Interior Atrás'
            };

            return Object.entries(photosData)
                .map(([key, src]) => ({
                    src: src as string,
                    alt: labelMap[key] || key,
                    caption: labelMap[key] || key
                }))
                .filter(p => p.src);
        }

        return [];
    };

    const getLabelForIndex = (idx: number) => {
        const labels = ['Frente', 'Atrás', 'Lateral Izq.', 'Lateral Der.', 'Interior Frente', 'Interior Atrás'];
        return labels[idx] || `Foto ${idx + 1}`;
    };

    const beforePhotos = formatPhotos(before);
    const afterPhotos = formatPhotos(after);

    return (
        <div className="space-y-8">
            {/* Antes del Servicio */}
            <div>
                <h4 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    ANTES del Servicio (Condición Inicial)
                </h4>
                {beforePhotos.length > 0 ? (
                    <ImageGallery images={beforePhotos} columns={3} gap={2} />
                ) : (
                    <div className="bg-black/20 rounded-lg p-4 text-center border border-white/5">
                        <span className="text-xs text-slate-600">No hay fotos de "Antes"</span>
                    </div>
                )}
            </div>

            {/* Después del Servicio */}
            <div>
                <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    DESPUÉS del Servicio (Trabajo Completado)
                </h4>
                {afterPhotos.length > 0 ? (
                    <ImageGallery images={afterPhotos} columns={3} gap={2} />
                ) : (
                    <div className="bg-black/20 rounded-lg p-4 text-center border border-white/5">
                        <span className="text-xs text-slate-600">No hay fotos de "Después"</span>
                    </div>
                )}
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { Screen } from '../types';
import { useToast } from './Toast';

interface NativeTestProps {
    navigate: (screen: Screen) => void;
}

export const NativeTest: React.FC<NativeTestProps> = ({ navigate }) => {
    const { showToast } = useToast();
    const [locationResult, setLocationResult] = useState<string>('Esperando ubicación...');
    const [fcmResult, setFcmResult] = useState<string>('Esperando token FCM...');
    const [dialogResult, setDialogResult] = useState<string>('Esperando acción...');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // --- 1. CONFIGURACIÓN DE CALLBACKS GLOBALES ---
    useEffect(() => {
        // Callback para Geolocalización
        window.onLocationReceived = (lat: number, lng: number) => {
            console.log("Native Location Received:", lat, lng);
            setLocationResult(`Ubicación recibida: Lat: ${lat}, Lon: ${lng}`);
            showToast(`Ubicación recibida: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'success');
        };

        // Callback para FCM
        // Nota: La implementación real en App.tsx ya maneja esto, pero lo sobrescribimos aquí para visualización
        // Ojo: Esto podría romper la lógica global si no tenemos cuidado.
        // Mejor solo "leemos" si pudiéramos, pero window.onFCMTokenReceived es una función.
        // Para este test, la interceptamos temporalmente.
        const originalFCMHandler = window.onFCMTokenReceived;
        window.onFCMTokenReceived = (token: string) => {
            console.log("Test UI received FCM:", token);
            setFcmResult(token);
            showToast('Token FCM Recibido', 'success');
            // Llamamos al handler original para que sigan funcionando las notificaciones reales
            if (originalFCMHandler) originalFCMHandler(token);
        };

        // Callback para Diálogos
        window.onDialogResult = (confirmed: boolean) => {
            console.log("Dialog Result:", confirmed);
            setDialogResult(confirmed ? "Acción confirmada. \u2705" : "Acción cancelada. \u274C");
            showToast(confirmed ? 'Confirmado' : 'Cancelado', 'info');
        };

        return () => {
            // Cleanup: Restaurar handlers si es necesario o dejarlos null
            window.onLocationReceived = undefined;
            window.onDialogResult = undefined;
            window.onFCMTokenReceived = originalFCMHandler;
        };
    }, [showToast]);

    // --- FUNCIONES DE ACCIÓN ---

    const handleShare = () => {
        const text = 'Estoy usando la mejor app de carwash. ¡Descárgala aquí: https://my-carwashapp-e6aba.web.app/';
        const title = 'Compartir Carwash App';
        if (window.Android && window.Android.shareText) {
            window.Android.shareText(text, title);
        } else {
            // Fallback web
            if (navigator.share) {
                navigator.share({ title, text, url: 'https://my-carwashapp-e6aba.web.app/' })
                    .catch(console.error);
            } else {
                navigator.clipboard.writeText(text);
                showToast('Link copiado al portapapeles (Simulado)', 'info');
            }
        }
    };

    const handleConfirm = () => {
        const title = 'Confirmar Borrado';
        const message = '¿Estás seguro de que quieres borrar este elemento? Esta acción es permanente.';

        if (window.Android && window.Android.showConfirmationDialog) {
            window.Android.showConfirmationDialog(title, message, 'onDialogResult');
        } else {
            // Fallback web simple
            const result = window.confirm(message);
            if (window.onDialogResult) window.onDialogResult(result);
        }
    };

    const handleLocation = () => {
        setLocationResult("Solicitando GPS...");
        if (window.Android && window.Android.requestLocation) {
            window.Android.requestLocation();
        } else {
            // Fallback web
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    if (window.onLocationReceived) window.onLocationReceived(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    setLocationResult(`Error: ${err.message}`);
                    showToast('Error obteniendo ubicación web', 'error');
                }
            );
        }
    };

    const handleNativeToast = () => {
        const msg = '¡Operación realizada con éxito!';
        if (window.Android && window.Android.showToast) {
            window.Android.showToast(msg);
        } else {
            showToast(msg, 'success');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            showToast('Imagen seleccionada', 'success');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 pb-20 overflow-y-auto">
            <div className="max-w-md mx-auto space-y-6">

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Test Nativo Android</h1>
                    <button
                        onClick={() => navigate(Screen.ADMIN_DASHBOARD)} // Or wherever appropriate
                        className="text-sm text-blue-600 font-medium"
                    >
                        Volver
                    </button>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-3">1. Cámara / Galería</h2>
                    <p className="text-sm text-slate-600 mb-3">Selector nativo de archivos.</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg w-full h-48 object-cover border border-slate-200" />
                    )}
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-3">2. Compartir</h2>
                    <p className="text-sm text-slate-600 mb-3">Intent de compartir nativo.</p>
                    <button
                        onClick={handleShare}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium active:scale-95 transition-transform"
                    >
                        ¡Comparte esta App!
                    </button>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-3">3. Diálogo Nativo</h2>
                    <p className="text-sm text-slate-600 mb-3">Alerta de confirmación del sistema.</p>
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium active:scale-95 transition-transform mb-3"
                    >
                        Borrar Elemento
                    </button>
                    <p className="bg-slate-100 p-3 rounded font-mono text-xs text-slate-700">{dialogResult}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-3">4. Geolocalización</h2>
                    <p className="text-sm text-slate-600 mb-3">Obtener lat/lng del GPS real.</p>
                    <button
                        onClick={handleLocation}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium active:scale-95 transition-transform mb-3"
                    >
                        Obtener Coordenadas
                    </button>
                    <p className="bg-slate-100 p-3 rounded font-mono text-xs text-slate-700">{locationResult}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-3">5. Toast Nativo</h2>
                    <p className="text-sm text-slate-600 mb-3">Mensaje flotante nativo Android.</p>
                    <button
                        onClick={handleNativeToast}
                        className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium active:scale-95 transition-transform"
                    >
                        Mostrar Toast
                    </button>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-3">6. Token FCM</h2>
                    <p className="text-sm text-slate-600 mb-3">Recepción pasiva del token.</p>
                    <p className="bg-slate-100 p-3 rounded font-mono text-xs text-slate-700 break-all">{fcmResult}</p>
                </div>

            </div>
        </div>
    );
};

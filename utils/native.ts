import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const isAndroid = (): boolean => {
    return typeof window !== 'undefined' && !!window.Android;
};

export const showNativeToast = (message: string): boolean => {
    if (isAndroid() && window.Android?.showToast) {
        window.Android.showToast(message);
        return true;
    }
    return false;
};

export const requestNativeLocation = (): boolean => {
    if (isAndroid() && window.Android?.requestLocation) {
        window.Android.requestLocation();
        return true;
    }
    return false;
};

export const triggerNativeHaptic = async (milliseconds: number = 50): Promise<void> => {
    try {
        await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
        // Fallback to traditional vibrate if Haptics plugin fails
        if (isAndroid() && window.Android?.vibrate) {
            window.Android.vibrate(milliseconds);
        } else if (navigator.vibrate) {
            navigator.vibrate(milliseconds);
        }
    }
};

export const shareNativeText = (text: string, title: string): boolean => {
    if (isAndroid() && window.Android?.shareText) {
        window.Android.shareText(text, title);
        return true;
    }
    return false;
};

export const showNativeConfirmation = (
    title: string,
    message: string,
    callbackName: string = 'onDialogResult'
): boolean => {
    if (isAndroid() && window.Android?.showConfirmationDialog) {
        window.Android.showConfirmationDialog(title, message, callbackName);
        return true;
    }
    return false;
};

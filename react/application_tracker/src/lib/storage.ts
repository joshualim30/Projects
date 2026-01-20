export const isElectron = (): boolean => {
    return typeof window !== 'undefined' && 'ipcRenderer' in window;
};

export const AppStorage = {
    getItem: async (key: string): Promise<string | null> => {
        if (isElectron()) {
            return await window.ipcRenderer.invoke('get-store-value', key);
        }
        return localStorage.getItem(key);
    },

    setItem: async (key: string, value: string): Promise<void> => {
        if (isElectron()) {
            await window.ipcRenderer.invoke('set-store-value', key, value);
        } else {
            localStorage.setItem(key, value);
        }
    },

    removeItem: async (key: string): Promise<void> => {
        if (isElectron()) {
            await window.ipcRenderer.invoke('delete-store-value', key);
        } else {
            localStorage.removeItem(key);
        }
    }
};

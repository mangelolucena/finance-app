export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiFetch = async (
    path: string,
    options: RequestInit = {}
) => {
    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
};

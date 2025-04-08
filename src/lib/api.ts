import {API_URL} from "@/lib/config";

const API_BASE_URL = API_URL;

export const api = {
    // POST Request
    // POST Request (Now Uses FormData)
    post: async (endpoint: string, data: any) => {
        const token = localStorage.getItem("token");

        // Construct FormData
        const formData = new FormData();
        
        // Handle files array specially
        if (data.files) {
            data.files.forEach((fileObj: any, index: number) => {
                // Append the actual binary file
                formData.append('files', fileObj.binary);
            });
            // Remove files from data object since we've handled them
            delete data.files;
        }

        // Append remaining fields
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        }

        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: formData,
        });

        if (res.status === 401) {
            const isRefreshed = await handleTokenRefresh();

            if (isRefreshed) {
                const refreshedToken = localStorage.getItem("token");
                headers.Authorization = `Bearer ${refreshedToken}`;

                res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers,
                    body: formData,
                });
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "POST request failed");
            (error as any).status = res.status;
            throw error;
        }

        return res.json();
    },
    // GET Request
    get: async (endpoint: string) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers,
        });

        // If token is expired, refresh it and retry the request
        if (res.status === 401) {
            const isRefreshed = await handleTokenRefresh();

            if (isRefreshed) {
                const refreshedToken = localStorage.getItem("token");
                headers.Authorization = `Bearer ${refreshedToken}`;

                // Retry the original request with the refreshed token
                res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "GET",
                    headers,
                });
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "GET request failed");
        }

        return res.json();
    },
    // PATCH Request
    patch: async (endpoint: string, data: any) => {
        const token = localStorage.getItem("token");

        // Construct FormData
        const formData = new FormData();
        const appendFormData = (formData: FormData, key: string, value: any) => {
            if (value === undefined || value === null) return;

            if (value instanceof File) {
                formData.append(key, value); // Append file directly
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (item instanceof File) {
                        formData.append(`${key}[${index}]`, item); // Append files in arrays
                    } else if (typeof item === "object") {
                        appendFormData(formData, `${key}[${index}]`, item); // Recursively handle objects in arrays
                    } else {
                        formData.append(`${key}[${index}]`, String(item));
                    }
                });
            } else if (typeof value === "object") {
                Object.keys(value).forEach((subKey) => {
                    appendFormData(formData, `${key}[${subKey}]`, value[subKey]); // Recursively handle nested objects
                });
            } else {
                formData.append(key, String(value));
            }
        };

        // Process all form data correctly
        Object.keys(data).forEach((key) => {
            appendFormData(formData, key, data[key]);
        });

        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PATCH",
            headers, // Do not include Content-Type; it is set automatically
            body: formData,
        });

        if (res.status === 401) {
            const isRefreshed = await handleTokenRefresh();

            if (isRefreshed) {
                const refreshedToken = localStorage.getItem("token");
                headers.Authorization = `Bearer ${refreshedToken}`;

                res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "PATCH",
                    headers,
                    body: formData,
                });
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "PATCH request failed");
            (error as any).status = res.status;
            throw error;
        }

        return res.json();
    },

    // PUT Request
    // PUT Request
    put: async (endpoint: string, data: any) => {
        const token = localStorage.getItem("token");

        // Construct FormData
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                if (data[key] instanceof File) {
                    // Append file if the key is "image" and it's a File object
                    formData.append(key, data[key]);
                } else {
                    // Append other fields as strings
                    formData.append(key, data[key]);
                }
            }
        }

        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers, // Do not include Content-Type; it is set automatically by the browser when using FormData
            body: formData,
        });

        if (res.status === 401) {
            const isRefreshed = await handleTokenRefresh();

            if (isRefreshed) {
                const refreshedToken = localStorage.getItem("token");
                headers.Authorization = `Bearer ${refreshedToken}`;

                res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "PUT",
                    headers,
                    body: formData,
                });
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "PUT request failed");
            (error as any).status = res.status;
            throw error;
        }

        return res.json();
    },

    // DELETE Request
    delete: async (endpoint: string) => {
        const headers: Record<string, string> = {};

        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers,
        });

        if (res.status === 401) {
            const isRefreshed = await handleTokenRefresh();

            if (isRefreshed) {
                const refreshedToken = localStorage.getItem("token");
                headers.Authorization = `Bearer ${refreshedToken}`;

                res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "DELETE",
                    headers,
                });
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "DELETE request failed");
        }

        return res.json();
    },
};

// Helper function to handle token refresh
const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return false;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (res.ok) {
            const { accessToken } = await res.json();
            localStorage.setItem("accessToken", accessToken); // Update the access token
            return true;
        } else {
            // Refresh failed, log out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // window.location.href = "/login";
            return false;
        }
    } catch (error) {
        // @ts-ignore
        console.error("Error refreshing token:", error.message);
        return false;
    }
};

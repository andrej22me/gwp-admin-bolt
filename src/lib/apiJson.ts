import {API_URL} from "@/lib/config";

const API_BASE_URL = API_URL;

export const apiJson = {
    // POST Request with Authorization
    post: async (endpoint: string, data?: any) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "POST request failed");
            (error as any).status = res.status;
            throw error;
        }

        return res.json();
    },

    // GET Request with Authorization
    get: async (endpoint: string) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "GET request failed");
        }

        return res.json();
    },

    // PATCH Request with Authorization
    patch: async (endpoint: string, data: any) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "PATCH request failed");
            (error as any).status = res.status;
            throw error;
        }

        return res.json();
    },

    // PUT Request with Authorization
    put: async (endpoint: string, data: any) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "PUT request failed");
            (error as any).status = res.status;
            throw error;
        }

        return res.json();
    },

    // DELETE Request with Authorization
    delete: async (endpoint: string, _data: any) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers,
            body: JSON.stringify(_data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "DELETE request failed");
        }

        return res.json();
    },
};

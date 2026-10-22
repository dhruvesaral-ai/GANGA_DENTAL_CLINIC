const fetchOptions = { credentials: "include" as RequestCredentials };

class ApiMethod {
    static async get(url: string) {
        const response = await fetch(url, fetchOptions);
        return response.json();
    }

    static async post(url: string, data: unknown) {
        const response = await fetch(url, {
            ...fetchOptions,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    static async put(url: string, data: unknown) {
        const response = await fetch(url, {
            ...fetchOptions,
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    static async patch(url: string, data: unknown) {
        const response = await fetch(url, {
            ...fetchOptions,
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    static async delete(url: string) {
        const response = await fetch(url, {
            ...fetchOptions,
            method: "DELETE",
        });
        return response.json();
    }

    static async upload(url: string, formData: FormData) {
        const response = await fetch(url, {
            ...fetchOptions,
            method: "POST",
            body: formData,
        });
        return response.json();
    }
}

export default ApiMethod;
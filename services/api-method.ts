class ApiMethod {
    static async get(url: string) {
        const response = await fetch(url);
        return response.json();
    }

    static async post(url: string, data: any) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    static async put(url: string, data: any) {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    static async delete(url: string) {
        const response = await fetch(url, {
            method: "DELETE",
        });
        return response.json();
    }
}

export default ApiMethod;
import { useState, useEffect } from "react";

export interface Context {
    id: string;
    key: string;
    value: string;
    url: string;
}

export function useContexts() {
    const [contexts, setContexts] = useState<Context[]>([]);

    useEffect(() => {
        const storedContexts = localStorage.getItem("contexts");
        if (storedContexts) {
            setContexts(JSON.parse(storedContexts));
        }
    }, []);

    const addContext = (newContext: Context) => {
        const updatedContexts = [...contexts, newContext];
        setContexts(updatedContexts);
        localStorage.setItem("contexts", JSON.stringify(updatedContexts));
    };

    const getContexts = (url: string) => {
        return contexts.filter((ctx) => ctx.url === url);
    };

    const deleteContext = (id: string) => {
        const updatedContexts = contexts.filter((ctx) => ctx.id !== id);
        setContexts(updatedContexts);
        localStorage.setItem("contexts", JSON.stringify(updatedContexts));
    };

    return { contexts, addContext, getContexts, deleteContext };
}

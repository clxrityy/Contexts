import React, { useEffect, useState } from "react";
import { Context, useContexts } from "../hooks/useContexts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { toast } from "react-hot-toast";
import { v4 as uuid } from 'uuid';
import { TrashIcon, BookCheck, PenLine, ScissorsLineDashed } from "lucide-react"


/**
 * ADD CONTEXT
 */
type AddContextProps = {
    currentUrl: string;
}

export function AddContext({ currentUrl }: AddContextProps) {
    const [ctx, setCtx] = useState<string>("");
    const [key, setKey] = useState<string>("");
    const { storedValue, setValue } = useLocalStorage<string>(key, "");

    const { addContext } = useContexts();

    const saveContext = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.length > 0 && ctx.length > 0) {
            addContext({ id: uuid(), key, value: ctx, url: currentUrl });
            setValue(ctx); // This now correctly updates localStorage
            toast.success("Context saved!", {
                icon: <BookCheck />,
                iconTheme: {
                    primary: "#10b981",
                    secondary: "#ffffff",
                }
            });
            location.reload();
        } else {
            toast.error("Please enter a key and context!", {
                icon: <PenLine />,
                iconTheme: {
                    primary: "#d16d6a",
                    secondary: "#ffffff",
                }
            });
        }
    };

    useEffect(() => {

    }, [storedValue]);

    return (
        <div className="flex items-center justify-center w-full mx-auto">
            <form onSubmit={saveContext} className="px-4 py-3 flex flex-col gap-4 items-center justify-center w-full">
                <div className="flex flex-row gap-4 items-center justify-end w-full">
                    <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                            e.preventDefault();
                            if (e.target.value.length < 32) {
                                setKey(e.target.value);
                            } else {
                                toast.error("Key too long! (Must be under 32 characters)", {
                                    icon: <ScissorsLineDashed />,
                                    iconTheme: {
                                        primary: "#d16d6a",
                                        secondary: "#ffffff",
                                    }
                                });
                            }
                        }}
                        placeholder="Key"
                        className="border rounded-xl px-3 py-2 text-xs border-white/50 focus:outline-none focus:border-blue-500 w-full text-sm min-w-[60px]"
                    />
                    <textarea
                        value={ctx}
                        onChange={(e) => {
                            e.preventDefault();
                            if (e.target.value.length < 256) {
                                setCtx(e.target.value);
                            } else {
                                toast.error("Context too long! (Must be under 256 characters)", {
                                    icon: <ScissorsLineDashed />,
                                    iconTheme: {
                                        primary: "#d16d6a",
                                        secondary: "#ffffff",
                                    }
                                });
                            }
                        }}
                        placeholder="Context..."
                        className="border rounded-xl px-3 py-2 text-xs border-white/50 focus:outline-none focus:border-blue-500 max-h-[120px] w-full min-w-[120px] max-w-1/2"
                    />
                </div>
                <button className="border border-zinc-400 rounded-xl px-3 py-2 text-sm hover:border-[#646cff] bg-zinc-900/90 cursor-pointer text-sm" type="submit">Save</button>
            </form>
        </div>
    );
}


/**
 * REMOVE CONTEXT
 */

type EditContextProps = {
    currentUrl: string;
    context: Context;
};

export function EditContext({ currentUrl, context }: EditContextProps) {
    const { contexts, deleteContext, getContexts } = useContexts();
    const { setValue } = useLocalStorage<string>(currentUrl, "[]");

    useEffect(() => {

    }, [contexts]);

    const remove = () => {
        const updatedContexts = getContexts(currentUrl).filter((ctx) => ctx.id !== context.id);
        setValue(JSON.stringify(updatedContexts)); // Update localStorage
        deleteContext(context.id); // Remove from state
        toast.success(`${context.key} removed!`, {
            icon: <TrashIcon />,
            style: {
                borderRadius: "10px",
                background: "#10b981",
                color: "#ffffff",
            }
        });
        location.reload();
    };

    return (
        <button className="rounded-xl border text-sm hover:border-red-500 border-[#d16d6a] bg-zinc-900/90 px-3 py-2 cursor-pointer focus:border-red-500 focus:outline-none focus:text-[#d16d6a]" onClick={remove}><TrashIcon size={12} /></button>
    );
}
/**
 * CONTEXTS
 */

interface ContextsProps {
    props: {
        tab: chrome.tabs.Tab;
    }
}

export function Contexts({ props }: ContextsProps) {
    const tabsUrl = props.tab.url;
    const { getContexts, contexts } = useContexts();
    const [filteredContexts, setFilteredContexts] = useState<Context[]>([]);

    useEffect(() => {
        if (tabsUrl) {
            setFilteredContexts(getContexts(tabsUrl));
        }
    }, [tabsUrl, contexts, getContexts]); // Listen to contexts too

    return (
        <div className="flex flex-col gap-10 items-center justify-start p-2 w-full">
            <div className="w-full relative overflow-y-auto h-fit max-h-[500px] scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-900">
                {filteredContexts.map((context) => (
                    <table key={context.id} className="flex flex-row gap-2 items-center justify-between p-2 w-full border-b border-b-zinc-300/50 text-center">
                        <th className="max-w-[100px]">
                            <h3 className="text-base font-medium">{context.key}:</h3>
                        </th>
                        <tr className="max-w-[200px]">
                            <p className="text-xs text-zinc-200 px-3 py-2 rounded-xl">{context.value}</p>
                        </tr>
                        {
                            tabsUrl && <tfoot>
                                <EditContext currentUrl={tabsUrl} context={context} />
                            </tfoot>
                        }
                        {/* <h3 className="text-lg font-medium">{context.key}</h3>
                    <p className="text-sm text-zinc-200 px-3 py-2 rounded-xl">{context.value}</p>
                    {tabsUrl && <RemoveContext currentUrl={tabsUrl} context={context} />} */}
                    </table>
                ))}
            </div>
            {
                tabsUrl && <AddContext currentUrl={tabsUrl} />
            }
        </div>
    );
}


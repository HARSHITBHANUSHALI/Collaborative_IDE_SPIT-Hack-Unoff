import { createContext, useState } from "react";

export const FileContext = createContext({});

export function FileContextProvider({ children }) {
    const [file, setFile] = useState(null);

    return (
        <FileContext.Provider value={{ file,setFile }}>
            {children}
        </FileContext.Provider>
    );
}


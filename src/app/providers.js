import MainContextProvider from "@/mainContext";

export function Providers({ children }) {
    return (
        <MainContextProvider>
            {children}
        </MainContextProvider>
    );
}
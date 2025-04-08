"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import {Provider} from "react-redux";
import {persistor, store} from "@/store/store";
import {PersistGate} from "redux-persist/integration/react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    // const pathname = usePathname();

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <html lang="en">
        <body suppressHydrationWarning={true}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <div className="dark:bg-boxdark-2 dark:text-bodydark">
                        {loading ? <Loader /> : children}
                    </div>
                </PersistGate>
            </Provider>
        </body>
        </html>
    );
}
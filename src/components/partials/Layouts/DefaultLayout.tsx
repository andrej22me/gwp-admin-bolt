"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/partials/Sidebar";
import Header from "@/components/partials/Header";
import { getToken } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const clearUser = useUserStore(state => state.clearUser);

    useEffect(() => {
        const token = getToken();
        const isAuth = !!token;
        setIsAuthenticated(isAuth);

        // Clear user data and redirect if not authenticated
        if (!isAuth) {
            clearUser();
            if (!pathname?.startsWith('/(auth)')) {
                router.push('/login');
            }
        }
    }, [pathname, clearUser]);

    // For auth pages, render only the content without layout
    if (!isAuthenticated || pathname?.startsWith('/(auth)')) {
        return (
            <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    {children}
                </div>
            </main>
        );
    }

    return (
        <>
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col lg:ml-72.5">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </>
    );
}

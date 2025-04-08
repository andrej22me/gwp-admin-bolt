import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getToken } from "./auth";

export const withAuth = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const token = getToken();

            if (!token) {
                router.replace("/auth/login");
            } else {
                setLoading(false);
            }
        }, []);

        if (loading) return <p>Loading...</p>;
        return <WrappedComponent {...props} />;
    };
};

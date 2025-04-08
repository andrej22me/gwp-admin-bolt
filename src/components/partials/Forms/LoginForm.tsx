"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { api } from '../../../lib/api';
import { setToken } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import {useAppDispatch} from "@/store/hooks";
import {setUser} from "@/store/userSlice";

export const metadata: Metadata = {
    title: "GWP Admin Panel | Sign In",
    description: "GWP Admin Panel - Sign In",
};

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(""); // Clear any previous errors

        try {
            const res = await api.post("/auth/login", formData);

            // Login successful
            setToken(res.access_token);
            dispatch(setUser(res.user));
            router.push("/");
        } catch (error: any) {
            console.error("Error during login:", error.message);

            // Display the error message under the password input
            setErrorMessage(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <DefaultLayout>
            <div className="rounded-sm border border-stroke w-full lg:w-1/2 m-auto bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-wrap items-center">
                    <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <div className="mb-8 flex items-center justify-center">
                                <Image src={"/logo-black.png"} alt={"GWP"} width={128} height={35} />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    {/* Display error message */}
                                    {errorMessage && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-5">
                                    <input
                                        type="submit"
                                        value="Sign In"
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SignIn;

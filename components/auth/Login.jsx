"use client"
import { useState, useContext, useEffect } from "react";
import { FaRegEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "@/apiUrl";
import { MainContext } from "@/mainContext";
import { mainRequest } from "@/axiosConfig";
import Loading from "../Loading";
import { useTranslation } from "@/src/app/i18n/client"; // Import the useTranslation hook
import Image from "next/image";

const Login = () => {
    const router = useRouter();
    const { t, i18n } = useTranslation(); // Access translation functions
    const { cart, settings, user, setUser } = useContext(MainContext);
    const logged = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("userRegistration"))?.logged : null;
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [userInfo, setUserInfo] = useState({
        "email": "",
        "password": ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const syncCartWithBackend = async () => {
        try {
            // Send cart data to the backend
            await mainRequest.post(`${apiUrl}/sync-cart`, { cart });
        } catch (error) {
            console.error("Error syncing cart data with the backend:", error);
        }
    };

    const handleLoginClick = async () => {
        setLoading(true);
        try {
            // Validate form inputs
            if (!userInfo.email || !userInfo.password) {
                toast.error(t("loginFormErrorFields"));
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userInfo.email)) {
                toast.error(t("loginFormErrorEmailFormat"));
                return;
            }

            // Validate password strength (you can add more specific criteria)
            if (userInfo.password.length < 8) {
                toast.error(t("loginFormErrorPasswordLength"));
                return;
            }

            // login logic
            const response = await axios.post(`${apiUrl}/login`,
                userInfo,
                {
                    withCredentials: true,
                    headers: {
                        'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'
                    }
                }
            );
            setUser({
                logged: true,
                active: true,
                activationToken: null,
                userInfo: response.data.user,
                accessToken: response.data?.accessToken
            })
            localStorage.setItem('userRegistration', JSON.stringify({
                logged: true,
                active: true,
                activationToken: null,
                userInfo: response.data.user,
                accessToken: response.data?.accessToken
            }));
            // Check if the login was successful
            if (response.status === 200) {
                // Display success message
                toast.success(t("loginSuccessMessage"));
                await syncCartWithBackend()
                router.push("/");
            } else {
                toast.error(t("loginFailedMessage"));
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(t("loginErrorMessage"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.logged || logged) {
            navigate("/")
        }

        if (user?.activationToken && (!user.active || user.active === false)) {
            navigate("/active-account")
        }

    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <div className="grid md:grid-cols-2" >
            <div className="image">
                <Image src="https://exclusive-ecommerce-client.vercel.app/assets/signup-img-5MB1hWiM.avif" alt="تسجيل دخول" className="w-full h-full object-cover" width={100} height={100} />
            </div>
            <div className="py-10 w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0">
                <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
                    <h1 className="w-full text-center border-b pb-4 text-2xl tracking-widest">{settings?.siteName}</h1>
                    <div className="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
                        <h5>{t("loginWithMessage")}</h5>
                    </div>
                    <div className="flex flex-wrap px-3 sm:px-6 xl:px-12 items-center justify-center">
                        <div className="max-w-full px-1">
                            <a
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 font-bold text-center text-gray-600 uppercase align-middle transition-all bg-transparent border border-gray-400 border-solid rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:brightness-125"
                            >
                                <FaGoogle />
                                <span>Google</span>
                            </a>
                        </div>
                        <div className="relative w-full max-w-full px-3 mt-2 text-center shrink-0">
                            <p className="z-20 inline px-4 mb-2 font-semibold leading-normal bg-white text-sm text-slate-400">
                                {t("loginOrMessage")}
                            </p>
                        </div>
                    </div>
                    <div className="flex-auto p-6">
                        <form role="form text-left">
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-1 opacity-75 capitalize">{t("loginEmailLabel")}</label>
                                <input
                                    aria-describedby="email-addon"
                                    aria-label="Email"
                                    placeholder={t("loginEmailPlaceholder")}
                                    className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={userInfo?.email}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="password" className="block mb-1 opacity-75 capitalize">{t("loginPasswordLabel")}</label>
                                <input
                                    aria-describedby="password-addon"
                                    aria-label="Password"
                                    placeholder={t("loginPasswordPlaceholder")}
                                    className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={userInfo?.password}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                {showPassword ? (
                                    <FaEyeSlash
                                        className={`text-xl absolute end-4 top-[2.4rem] cursor-pointer`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                ) : (
                                    <FaRegEye
                                        className={`text-xl absolute end-4 top-[2.4rem] cursor-pointer`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                )}
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={handleLoginClick}
                                    className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-gray-900 to-slate-800 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                                    type="button"
                                >
                                    {t("loginButton")}
                                </button>
                            </div>
                            <p className="mt-4 mb-0 leading-normal text-sm">
                                {t("loginNoAccountMessage")}{" "}
                                <Link href="/signUp" className="font-bold text-slate-700" to="/login">
                                    {t("loginSignupLink")}
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

"use client"
import { FaEyeSlash, FaGoogle, FaRegEye } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { MainContext } from "@/mainContext";
import { apiUrl } from "@/apiUrl";
import Link from "next/link";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import loginImg from "../../public/account.jpeg"

const SignUp = () => {
    const router = useRouter();
    const { user, setUser } = useContext(MainContext);
    const { t, i18n } = useTranslation();
    const [userInfo, setUserInfo] = useState({
        "name": "",
        "email": "",
        "password": "",
        "confirmPassword": "",
    });
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = () => {
        setTermsAgreed((prevTermsAgreed) => !prevTermsAgreed);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };

    const handleSignUp = async () => {
        setLoading(true);
        try {
            // Validate form inputs
            if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.confirmPassword) {
                toast.error(t('signUpFormErrorFields'));
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userInfo.email)) {
                toast.error(t('signUpFormErrorEmailFormat'));
                return;
            }

            // Validate password strength
            if (userInfo.password.length < 8) {
                toast.error(t('signUpFormErrorPasswordLength'));
                return;
            }

            // Validate password and confirmPassword match
            if (userInfo.password !== userInfo.confirmPassword) {
                toast.error(t('signUpFormErrorPasswordsMatch'));
                return;
            }

            // Validate terms agreement
            if (!termsAgreed) {
                toast.error(t('signUpFormErrorTermsAgreement'));
                return;
            }

            // Sign-up logic
            const response = await axios.post(`${apiUrl}/registration`, userInfo);
            setUser({
                active: false,
                activationToken: response?.data?.activationToken,
                userInfo: {
                    name: userInfo.name,
                    email: userInfo.email
                }
            });
            localStorage.setItem('userRegistration', JSON.stringify({
                active: false,
                activationToken: response?.data?.activationToken,
                userInfo: {
                    name: userInfo.name,
                    email: userInfo.email
                }
            }));
            // Check if the sign-up was successful
            if (response.status === 201) {
                // Display success message
                toast.success(response?.data?.message);
                router.push("/activeAccount");
            } else {
                toast.error(t('signUpFailedMessage'));
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            toast.error(t('signUpErrorMessage'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Redirect if user is already logged in
        if (user?.logged || typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("userRegistration"))?.logged : null) {
            router.push("/");
        }

        // Redirect if user needs activation
        if (user?.activationToken && (user.active || user.active === false)) {
            router.push("/activeAccount");
        }
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="grid md:grid-cols-2">
            <div className="image">
                <Image width={100} height={100} src={loginImg} alt={t('signUpTitle')} className="w-full h-full object-cover" />
            </div>
            <div className="py-10 w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0">
                <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
                    <h1 className="w-full text-center border-b pb-4 text-2xl tracking-widest">{t('signUpTitle')}</h1>

                    <div className="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
                        <h5>{t('signUpUsing')}</h5>
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
                                {t('signUpOr')}
                            </p>
                        </div>
                    </div>
                    <div className="flex-auto p-6">
                        <form role="form text-left">
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-1 opacity-75 capitalize">{t('signUpNameLabel')}</label>
                                <input
                                    aria-describedby="user-name"
                                    aria-label="Name"
                                    placeholder={t('signUpNamePlaceholder')}
                                    className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={userInfo?.name}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-1 opacity-75 capitalize">{t('signUpEmailLabel')}</label>
                                <input
                                    aria-describedby="email-addon"
                                    aria-label="Email"
                                    placeholder={t('signUpEmailPlaceholder')}
                                    className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={userInfo?.email}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="password" className="block mb-1 opacity-75 capitalize">{t('signUpPasswordLabel')}</label>
                                <input
                                    aria-describedby="password-addon"
                                    aria-label="Password"
                                    placeholder={t('signUpPasswordPlaceholder')}
                                    className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={userInfo?.password}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                {
                                    showPassword
                                        ?
                                        <FaEyeSlash className={`text-xl absolute end-4 top-[2.4rem] cursor-pointer`} onClick={() => setShowPassword(!showPassword)} />
                                        :
                                        <FaRegEye className={`text-xl absolute end-4 top-[2.4rem] cursor-pointer`} onClick={() => setShowPassword(!showPassword)} />
                                }
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="confirmPassword" className="block mb-1 opacity-75 capitalize">{t('signUpConfirmPasswordLabel')}</label>
                                <input
                                    aria-describedby="password-addon"
                                    aria-label="Confirm Password"
                                    placeholder={t('signUpConfirmPasswordPlaceholder')}
                                    className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={userInfo?.confirmPassword}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                {
                                    showConfirmPassword
                                        ?
                                        <FaEyeSlash className={`text-xl absolute end-4 top-[2.4rem] cursor-pointer`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                        :
                                        <FaRegEye className={`text-xl absolute end-4 top-[2.4rem] cursor-pointer`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                }
                            </div>
                            <div className="min-h-6 pl-7 mb-0.5 block">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 ease-soft -ml-7 rounded-1.4 duration-250 relative float-left mt-1 cursor-pointer border border-solid border-slate-200 align-top transition-all"
                                    id="terms"
                                    checked={termsAgreed}
                                    onChange={handleCheckboxChange}
                                />
                                <label
                                    htmlFor="terms"
                                    className="mb-2 ml-1 font-normal cursor-pointer select-none text-sm text-slate-700">
                                    {t('signUpAgreeTo')}{" "}
                                    <Link href="/TermsAndConditions" className="font-bold text-slate-700">{t('signUpTermsAndConditions')}</Link>
                                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline ml-1 fill-current text-green-500">
                                        <path d="M6.293 9.293a1 1 0 0 1 1.414 0L10 10.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"></path>
                                    </svg>
                                </label>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleSignUp}
                                    className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-gray-900 to-slate-800 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                                    type="button"
                                >
                                    {t('signUpButton')}
                                </button>
                            </div>
                            <p className="mt-4 mb-0 leading-normal text-sm">{t('signUpAlreadyHaveAccount')}
                                <Link className="font-bold text-slate-700" href="/login">{t('signUpLoginLink')}</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;

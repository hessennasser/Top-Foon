"use client"
import { MainContext } from "@/mainContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaBars, FaShoppingBag, FaSignInAlt, FaTimes, FaUser } from "react-icons/fa";
import userAvatar from "../../public/userAvatar.jpg";
import SubMenu from "./SubMenu";
import { useTranslation } from "@/src/app/i18n/client";

const Navbar = () => {
    const { t, i18n } = useTranslation(); // Access translation functions and current language
    const router = useRouter();
    const [nav, setNav] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { settings, cart, user } = useContext(MainContext);
    const logged = JSON.parse(localStorage.getItem("userRegistration"))?.logged;
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const links = [
        {
            id: 1,
            link: t('home'),
            url: `/${i18n.language}/`
        },
        {
            id: 2,
            link: t('about'),
            url: `/${i18n.language}/about-us`
        },
        {
            id: 3,
            link: t('contact'),
            url: `/${i18n.language}/contact-us`
        }
    ];

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setNav(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            router.push(`/allProduct?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
    };

    // Function to handle language change
    const handleLanguageChange = (selectedLang) => {
        // Change the language
        i18n.changeLanguage(selectedLang);

        // Get the current URL
        const currentUrl = window.location.href;

        // Extract the base path without query parameters
        const basePath = currentUrl.split(/\?/)[0];

        // Build the new URL with the selected language
        const newUrl = `/${selectedLang}`;

        // Redirect the user to the new URL
        window.location.href = newUrl;
    };

    return (
        <>
            {
                logged && profileMenuOpen && <SubMenu user={user} />
            }
            <div className="flex justify-between items-center w-full h-20 px-4 sticky top-0 bg-white shadow-lg nav z-10">
                <div>
                    <Link
                        href={`/${i18n.language}/`}
                    >
                        <Image src={settings?.logo?.url} alt={settings?.siteName} className='object-contain' width={50} height={50} />
                    </Link>
                </div>

                <ul className="hidden md:flex">
                    {links.map(({ id, link, url }) => (
                        <li
                            key={id}
                            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 duration-200 link-underline text-lg"
                        >
                            <Link href={url}>{link}</Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-end flex-1 relative">
                    <form onSubmit={handleSearchSubmit} className="w-fit">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleKeyPress}
                            className="hidden md:block mr-4 px-2 py-1 rounded border border-gray-300 focus:outline-none"
                        />
                    </form>
                    {
                        !logged ? (
                            <>
                                <Link href={`/${i18n.language}/login`} className="mx-2" title={t('login')}>
                                    <FaSignInAlt className="text-2xl" />
                                </Link>
                                <Link href={`/${i18n.language}/signUp`} className="mx-2" title={t('signUp')}>
                                    <FaUser className="text-2xl" />
                                </Link>
                            </>
                        )
                            :
                            (
                                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                                    <Image width="50" height="50" className="rounded-full" src={userAvatar} alt="User Avatar" />
                                </button>
                            )
                    }

                    <Link href={`/${i18n.language}/cart`} className="mx-2 relative">
                        <FaShoppingBag className="text-2xl" />
                        <span
                            className="absolute w-7 h-7 bg-orange-500 -top-5 right-2 text-white rounded-full flex items-center justify-center"
                        >
                            {cart?.length}
                        </span>
                    </Link>
                    <div
                        onClick={() => setNav(!nav)}
                        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
                    >
                        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
                    </div>
                </div>

                {/* Language Selector */}
                <select value={i18n.language} onChange={(e) => handleLanguageChange(e.target.value)} className="ml-2 focus:outline-none">
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                </select>

                {nav && (
                    <ul className="flex flex-col justify-center items-center absolute top-20 left-0 w-full shadow-lg bg-white">
                        {links.map(({ id, link, url }) => (
                            <li
                                key={id}
                                className="px-4 cursor-pointer capitalize py-6 text-4xl"
                            >
                                <Link onClick={() => setNav(!nav)} href={url}>
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>

    );
};

export default Navbar;

"use client"
import userAvatar from "../../public/userAvatar.jpg"
import { FaChevronLeft, FaRegUser } from "react-icons/fa";
import { IoIosLogOut, IoMdSettings } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { CiCreditCard1 } from "react-icons/ci";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { MainContext } from "@/mainContext";
import { useTranslation } from "@/src/app/i18n/client";

const SubMenu = ({ user }) => {
    const { logout } = useContext(MainContext);
    const { t, i18n } = useTranslation();
    console.log(i18n);
    return (
        <div
            className={`absolute top-20 ${i18n.language == "ar" ? "right" : "left"}-1/2 translate-x-1/2 md:${i18n.language == "ar" ? "left" : "right"}-20 md:translate-x-0 w-full max-w-72 md:max-w-sm rounded-lg bg-slate-500 text-white shadow-2xl p-4 flex flex-col gap-2 z-10`}
        >
            <div className="flex items-center justify-between gap-4 border-b pb-4 border-gray-100">
                <Image width="32" height="32" className="w-8 h-8 rounded-full" src={userAvatar} alt="صورة المستخدم" />
                <span className="flex-1 border-s ps-2 border-s-gray-100">{user?.userInfo?.name}</span>
            </div>
            <div className="flex flex-col gap-4 text-lg border-b pb-4 border-gray-100">
                <Link href="/myAccount" className="flex items-center justify-between gap-2">
                    <FaRegUser />
                    <span className="flex-1">{t('my_account')}</span>
                    <FaChevronLeft />
                </Link>
                <Link href="/purchases" className="flex items-center justify-between gap-2">
                    <CiCreditCard1 />
                    <span className="flex-1">{t('purchases')}</span>
                    <FaChevronLeft />
                </Link>
                {/* <Link href="/myAccount" className="flex items-center justify-between gap-2">
                    <IoMdSettings />
                    <span className="flex-1">{t('settings')}</span>
                    <FaChevronLeft />
                </Link> */}
            </div>
            <div className="flex flex-col gap-4 text-lg">
                {/* <Link href="/myAccount" className="flex items-center justify-between gap-2">
                    <BiSupport />
                    <span className="flex-1">{t('support')}</span>
                    <FaChevronLeft />
                </Link> */}
                <button className="w-full flex items-center justify-between gap-2" onClick={logout}>
                    <IoIosLogOut />
                    <span className="flex-1 text-start">{t('logout')}</span>
                </button>
            </div>
        </div>
    )
}

export default SubMenu

"use client"
import Image from "next/image";
import Link from "next/link";
import notFound from "../../public/404.svg"
import "./globals.css"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Image className="w-1/2" src={notFound} width={100} height={100} alt="404 - not found" />
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link className="main-btn" href="/">Return Home</Link>
        </div>
    );
}

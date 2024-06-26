import Footer from "@/components/footer/footer";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Providers } from "../providers";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import { Suspense } from "react";
import Loading from "@/components/Loading";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}) {

  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <title>Top Foon</title>
        <link rel="icon" href="/favIcon.png" />
      </head>
      <body >
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Providers>
          <Suspense fallback={<Loading />}>
            <Navbar />
            <main className="root">
              {children}
            </main>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html >
  );
}

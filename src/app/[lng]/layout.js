import Footer from "@/components/footer/footer";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Providers } from "../providers";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { dir } from 'i18next'
import { languages } from '../i18n/settings'

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
        <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.13.0/moyasar.css" />
        <script src="https://cdn.moyasar.com/mpf/1.13.0/moyasar.js" async></script>
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
          <Navbar />
          <main className="root">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html >
  );
}

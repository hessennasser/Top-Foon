import "./globals.css"

export default function RootLayout({ children }) {

    return (
        <html>
            <head>
                <title>Top Foon</title>
                <link rel="icon" href="/favIcon.png" />
            </head>
            <body >
                <main className="root">
                    {children}
                </main>
            </body>
        </html >
    );
}

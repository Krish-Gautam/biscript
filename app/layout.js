import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "./useClient/NavbarWrapper";
import ProgressBar from "./components/ProgressBar";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Biscript - Learn Code the Fun Way",
  description: "Solve engaging challenges, earn achievements, and level up your programming skills one game at a time.",
  keywords: ["programming", "coding", "challenges", "learning", "education"],
  authors: [{ name: "Biscript Team" }],
  openGraph: {
    title: "Biscript - Learn Code the Fun Way",
    description: "Solve engaging challenges, earn achievements, and level up your programming skills one game at a time.",
    type: "website",
  },
};

export default async function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="absolute top-0 z-[-2] h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        {/* Wrap Navbar and children with AuthProvider */}
        <AuthProvider>
          <Suspense >
            <NavbarWrapper />
          </Suspense>

          <main className="flex-1 ">
            <ProgressBar />
            {children}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerStyle={{ top: 16, right: 16 }}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#232526',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#0f0f10' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#0f0f10' } },
              }}
            />
          </main>
        </AuthProvider>
      </body>

    </html>
  );
}

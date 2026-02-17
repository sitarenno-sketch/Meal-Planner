import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Bloom Kitchen",
  description: "Plan your meals nicely.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} flex h-screen overflow-hidden text-gray-800`}>
          {/* Soft Background Globs */}
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent opacity-70 pointer-events-none" />
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70 pointer-events-none" />

          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full relative">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
              {children}
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

// src/app/(public)/layout.tsx
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer/Footer";
import GlobalOverlay from "../components/GlobalOverlay";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="w-full flex flex-col fixed z-30">
        <Navbar />
      </header>
      <main className="pt-24">{children}</main>
      <footer>
        <Footer />
      </footer>
      <GlobalOverlay />
    </>
  );
}
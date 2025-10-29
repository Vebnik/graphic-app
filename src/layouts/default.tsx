import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen dark:bg-gray-800 transition-all fade-in">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://github.com/Vebnik"
          title="GitHub"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NikEvs</p>
        </Link>
      </footer>
    </div>
  );
}

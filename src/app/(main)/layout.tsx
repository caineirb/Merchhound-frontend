import "@/app/globals.css";
import SideBar from "@/components/SideBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen bg-background">
        <SideBar />
        <section className="flex-1 p-6 overflow-auto bg-background text-foreground">
            {children}
        </section>
    </main>
  )
}

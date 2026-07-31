import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import { getPublicSettings } from "@/lib/gold-api";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton phone={settings.phone} />
      <BackToTop />
    </>
  );
}

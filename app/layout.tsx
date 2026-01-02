import "../public/assets/sass/styles.scss";
import "../public/assets/sass/animations.scss";
// import { config } from "@fortawesome/fontawesome-svg-core";
// import "@fortawesome/fontawesome-svg-core/styles.css";
// import "react-calendar/dist/Calendar.css";
// import Header from "@/components/layout/headers/Header";
import Header from "@/components/Header";
// import FooterOne from "@/components/layout/footers/FooterOne";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { CartSyncProvider } from "@/components/providers/CartSyncProvider";
// config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic={true}>
      <html lang="en">
        <body>
          <CartSyncProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartSyncProvider>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}


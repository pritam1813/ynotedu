import "../public/assets/sass/styles.scss";
import "../public/assets/sass/animations.scss";
// import { config } from "@fortawesome/fontawesome-svg-core";
// import "@fortawesome/fontawesome-svg-core/styles.css";
// import "react-calendar/dist/Calendar.css";
// import Header from "@/components/layout/headers/Header";
import Header from "@/components/Header";
// import FooterOne from "@/components/layout/footers/FooterOne";
import Footer from "@/components/Footer";
// config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

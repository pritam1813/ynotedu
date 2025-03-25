import React from "react";
import Image from "next/image";
import { socialMediaLinks } from "@/data/socials";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewsletterForm from "./NewsletterForm";
import { bottomLinks, mainLinks } from "@/data/footer";

export default function Footer() {
  return (
    <footer className="footer -type-1 bg-dark-1 -green-links">
      <div className="container">
        <div className="footer-header">
          <div className="row y-gap-20 justify-between items-center">
            <div className="col-auto">
              <div className="footer-header__logo">
                <Image
                  width={140}
                  height={50}
                  src="/assets/img/footer/footer-logo.svg"
                  alt="logo"
                />
              </div>
            </div>
            <div className="col-auto">
              <div className="footer-header-socials">
                <div className="footer-header-socials__title text-white">
                  Follow us on social media
                </div>
                <div className="footer-header-socials__list">
                  {socialMediaLinks.map((link, index) => (
                    <Link
                      key={index}
                      //   className={componentsClass ? componentsClass : ""}
                      href={link.href}
                    >
                      {/* <i className={`${link.iconClassName} ${textSize}`}></i> */}
                      <FontAwesomeIcon icon={link.icon} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-columns">
          <div className="row y-gap-30">
            {/* <FooterLinks
              allClasses={"text-17 fw-500 text-white uppercase mb-25"}
            /> */}
            {mainLinks.map((elm, i) => (
              <div key={i} className="col-xl-2 col-lg-4 col-md-6">
                <div className="text-17 fw-500 text-white uppercase mb-25">
                  {elm.title}
                </div>
                <div className="d-flex y-gap-10 flex-column">
                  {elm.links.map((itm, index) => (
                    <Link key={index} href={itm.href}>
                      {itm.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="text-17 fw-500 text-white uppercase mb-25">
                GET IN TOUCH
              </div>
              <div className="footer-columns-form">
                <div>We don’t send spam so don’t worry.</div>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        <div className="py-30 border-top-light-15">
          <div className="row justify-between items-center y-gap-20">
            <div className="col-auto">
              <div className="d-flex items-center h-100 text-white">
                © {new Date().getFullYear()} ynotedu. All Right Reserved.
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex x-gap-20 y-gap-20 items-center flex-wrap">
                <div>
                  <div className="d-flex x-gap-15 text-white">
                    {bottomLinks.map((link, index) => (
                      <Link key={index} href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="#"
                    className="button px-30 h-50 -dark-6 rounded-200 text-white"
                  >
                    <i className="icon-worldwide text-20 mr-15"></i>
                    <span className="text-15">English</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

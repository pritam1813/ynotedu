import React from "react";
import Link from "next/link";
import { socialMediaLinks } from "@/data/socials";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MobileFooter() {
  return (
    <div className="mobile-footer px-20 py-20 border-top-light js-mobile-footer">
      <div className="mobile-footer__number">
        <div className="text-17 fw-500 text-dark-1">Call us</div>
        <div className="text-17 fw-500 text-purple-1">800 388 80 90</div>
      </div>

      <div className="lh-2 mt-10">
        <div>
          329 Queensberry Street,
          <br /> North Melbourne VIC 3051, Australia.
        </div>
        <div>hi@ynotedu.com</div>
      </div>

      <div className="mobile-socials mt-10">
        {socialMediaLinks.map((social) => (
          <Link
            key={social.id}
            href={social.href}
            className="d-flex items-center justify-center rounded-full size-40"
          >
            <FontAwesomeIcon icon={social.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeaderExplore from "./HeaderExplore";
import Menu from "./Menu";
import MobileMenu from "./MobileMenu";

// From /components/layout/headers/Header
export default function Header() {
  return (
    <header className="header -type-1 ">
      <div className="header__container">
        <div className="row justify-between items-center">
          <div className="col-auto">
            <div className="header-left">
              <div className="header__logo ">
                <Link href="/">
                  <Image
                    width={140}
                    height={50}
                    src="/assets/img/general/logo.svg"
                    alt="logo"
                  />
                </Link>
              </div>

              {/* header explore start */}
              {/* <HeaderExplore
                  allClasses={
                    "header__explore text-green-1 ml-60 xl:ml-30 xl:d-none"
                  }
                /> */}
              <HeaderExplore />
              {/* header explore end */}
            </div>
          </div>

          {/* <Menu allClasses={"menu__nav text-white -is-active"} /> */}
          <Menu />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

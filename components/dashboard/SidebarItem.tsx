"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

interface SidebarItemProps {
  item: {
    href: string;
    iconClass: string;
    text: string;
  };
}

export default function SidebarItem({ item }: SidebarItemProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();

  const isLogoutItem = item.text === "Logout";

  const handleClick = (e: React.MouseEvent) => {
    if (isLogoutItem) {
      e.preventDefault();
      signOut(() => {
        router.push("/");
      });
    }
  };

  return (
    <div
      className={`sidebar__item ${pathname === item.href ? "-is-active" : ""}`}
    >
      {isLogoutItem ? (
        <button
          onClick={handleClick}
          className="d-flex items-center text-17 lh-1 fw-500 w-100"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <i className={`${item.iconClass} mr-15`}></i>
          {item.text}
        </button>
      ) : (
        <Link
          href={item.href}
          className="d-flex items-center text-17 lh-1 fw-500"
        >
          <i className={`${item.iconClass} mr-15`}></i>
          {item.text}
        </Link>
      )}
    </div>
  );
}

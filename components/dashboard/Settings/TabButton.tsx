"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TabButton({
  tabId,
  label,
  isActive,
}: {
  tabId: string;
  label: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <button
      onClick={handleClick}
      className={`tabs__button text-light-1 js-tabs-button ${
        isActive ? "is-active" : ""
      }`}
      type="button"
    >
      {label}
    </button>
  );
}

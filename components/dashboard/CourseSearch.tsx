"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function CourseSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 800);

  return (
    <form className="search-field border-light rounded-8 h-50">
      <input
        required
        className="bg-white -dark-bg-dark-2 pr-50"
        type="text"
        placeholder="Search Courses"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("search")?.toString()}
      />
      <button className="" type="submit">
        <i className="icon-search text-light-1 text-20"></i>
      </button>
    </form>
  );
}

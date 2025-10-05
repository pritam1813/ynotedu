import { Roles } from "@/types/globals";

interface SidebarItem {
  id: number;
  href: string;
  iconClass: string;
  text: string;
  roles?: Roles[];
}

export const sidebarItems: SidebarItem[] = [
  {
    id: 1,
    href: "/dashboard",
    iconClass: "text-20 icon-discovery",
    text: "Dashboard",
    roles: ["admin", "instructor", "student"],
  },
  {
    id: 22,
    href: "/dashboard/courses",
    iconClass: "text-20 icon-discovery",
    text: "Courses",
    roles: ["admin", "instructor"],
  },
  {
    id: 23,
    href: "/dashboard/manageinstructor?page=1",
    iconClass: "text-20 icon-play-button",
    text: "Manage Instructor",
    roles: ["admin"],
  },
  {
    id: 2,
    href: "/dshb-courses",
    iconClass: "text-20 icon-play-button",
    text: "My Courses",
    roles: ["admin", "instructor", "student"],
  },

  {
    id: 3,
    href: "/dshb-bookmarks",
    iconClass: "text-20 icon-bookmark",
    text: "Bookmarks",
    roles: ["admin"],
  },
  {
    id: 19,
    href: "/dashboard/scheduleclass",
    text: "Schedule Class",
    iconClass: "text-20 icon-list",
    roles: ["admin", "instructor"],
  },
  {
    id: 4,
    href: "/dshb-messages",
    iconClass: "text-20 icon-message",
    text: "Messages",
    roles: ["admin"],
  },
  {
    id: 5,
    href: "/dshb-listing",
    iconClass: "text-20 icon-list",
    text: "Create Course",
    roles: ["admin", "instructor"],
  },
  {
    id: 6,
    href: "/dshb-reviews",
    iconClass: "text-20 icon-comment",
    text: "Reviews",
    roles: ["admin"],
  },
  {
    id: 7,
    href: "/dashboard/settings",
    iconClass: "text-20 icon-setting",
    text: "Settings",
    roles: ["admin", "student", "instructor"],
  },

  {
    id: 9,
    href: "/dshb-administration",
    text: "Administration",
    iconClass: "text-20 icon-person-2",
    roles: ["admin"],
  },
  {
    id: 10,
    href: "/dshb-assignment",
    text: "Assignment",
    iconClass: "text-20 icon-edit",
    roles: ["admin", "instructor", "student"],
  },
  {
    id: 11,
    href: "/dshb-calendar",
    text: "Calendar",
    iconClass: "text-20 icon-calendar",
    roles: ["admin", "instructor"],
  },
  {
    id: 12,
    href: "/dshb-dashboard",
    text: "Single Dashboard",
    iconClass: "text-20 icon-discovery",
    roles: ["admin"],
  },
  {
    id: 13,
    href: "/dshb-dictionary",
    text: "Dictionary",
    iconClass: "text-20 icon-book",
    roles: ["admin"],
  },
  {
    id: 14,
    href: "/dshb-forums",
    text: "Forums",
    iconClass: "text-20 icon-access",
    roles: ["admin"],
  },
  {
    id: 15,
    href: "/dshb-grades",
    text: "Grades",
    iconClass: "text-20 icon-badge",
    roles: ["admin", "instructor", "student"],
  },
  {
    id: 16,
    href: "/dshb-messages",
    text: "Messages",
    iconClass: "text-20 icon-message",
    roles: ["admin"],
  },
  {
    id: 17,
    href: "/dshb-participants",
    text: "Participants",
    iconClass: "text-20 icon-person-3",
    roles: ["admin", "instructor"],
  },
  {
    id: 18,
    href: "/dshb-quiz",
    text: "Quiz",
    iconClass: "text-20 icon-time-management",
    roles: ["admin"],
  },
  {
    id: 19,
    href: "/dshb-survey",
    text: "Survey",
    iconClass: "text-20 icon-list",
    roles: ["admin"],
  },
  {
    id: 8,
    href: "/",
    iconClass: "text-20 icon-power",
    text: "Logout",
    roles: ["admin", "instructor", "student"],
  },
];

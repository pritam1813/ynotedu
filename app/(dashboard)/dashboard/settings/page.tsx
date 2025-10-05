import React from "react";
import Settings from "@/components/dashboard/Settings/Settings";
import { currentUser } from "@clerk/nextjs/server";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { User, UserProfile } from "@prisma/client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface UserDetails {
  user: User;
  profile: UserProfile;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  const res = await fetch(`${getBaseUrl()}/api/user/${user.id}`);
  const fromdb: UserDetails = await res.json();
  // console.log(fromdb.profile);

  const params = await searchParams;
  const tabParam = params.tab;

  const tab = Array.isArray(tabParam)
    ? tabParam[0]
    : tabParam ?? "edit-profile";

  return <Settings currentTab={tab} profile={fromdb.profile} />;
}

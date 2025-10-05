// app/settings/page.tsx (Server Component)
import React from "react";
import EditProfile from "./EditProfile";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";

import Notification from "./Notifications";
import TabButton from "./TabButton";
import type { UserProfile } from "@prisma/client";
import EditProfileForm from "./EditProfileForm";

const tabs = [
  { id: "edit-profile", label: "Edit Profile", index: 1 },
  { id: "password", label: "Password", index: 2 },
  { id: "social-profiles", label: "Social Profiles", index: 3 },
  { id: "notifications", label: "Notifications", index: 4 },
  { id: "close-account", label: "Close Account", index: 5 },
];

export default async function Settings({
  currentTab,
  profile,
}: {
  currentTab: string;
  profile: UserProfile;
}) {
  // Default to first tab if no tab specified

  const activeTabIndex = tabs.find((t) => t.id === currentTab)?.index || 1;

  // console.log(profile);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Settings</h1>
            <div className="mt-10">
              Lorem ipsum dolor sit amet, consectetur.
            </div>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                <div className="tabs__controls d-flex x-gap-30 y-gap-20 flex-wrap items-center pt-20 px-30 border-bottom-light js-tabs-controls">
                  {tabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      tabId={tab.id}
                      label={tab.label}
                      isActive={currentTab === tab.id}
                    />
                  ))}
                </div>

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  {/* <EditProfile activeTab={activeTabIndex} /> */}
                  <EditProfileForm
                    activeTab={activeTabIndex}
                    profile={profile}
                  />
                  <Password activeTab={activeTabIndex} />
                  <SocialProfiles activeTab={activeTabIndex} />
                  <Notification activeTab={activeTabIndex} />
                  <CloseAccount activeTab={activeTabIndex} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

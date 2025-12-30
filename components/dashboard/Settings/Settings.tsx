"use client";
import React, { useState } from "react";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";
import Notification from "./Notifications";
import type { UserProfile } from "@prisma/client";
import EditProfileForm from "./EditProfileForm";

const tabs = [
  { id: "edit-profile", label: "Edit Profile", index: 1 },
  { id: "password", label: "Password", index: 2 },
  { id: "social-profiles", label: "Social Profiles", index: 3 },
  { id: "notifications", label: "Notifications", index: 4 },
  { id: "close-account", label: "Close Account", index: 5 },
];

export default function Settings({
  initialTab,
  profile,
}: {
  initialTab: string;
  profile: UserProfile;
}) {
  // Client-side tab state - no server calls on tab switch
  const [activeTab, setActiveTab] = useState(
    tabs.find((t) => t.id === initialTab)?.index || 1
  );

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
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.index)}
                      className={`tabs__button text-light-1 js-tabs-button ${activeTab === tab.index ? "is-active" : ""
                        }`}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <EditProfileForm activeTab={activeTab} profile={profile} />
                  <Password activeTab={activeTab} />
                  <SocialProfiles activeTab={activeTab} />
                  <Notification activeTab={activeTab} />
                  <CloseAccount activeTab={activeTab} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

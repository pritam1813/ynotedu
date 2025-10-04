import React from "react";

import PageLinksNew from "@/components/common/PageLinkNew";
import EventKeysTwo from "./calendar/EventKeysTwo";
import ScheduleClassForm from "./ScheduleClassForm";

export default function MeetCalender() {
  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Class Schedule</h1>
            <PageLinksNew />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9 col-lg-9 md:mb-20">
            <div className="col-12">
              <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4">
                <div className="d-flex items-center py-20 px-30 border-bottom-light">
                  <h2 className="text-17 lh-1 fw-500">Online Class Schedule</h2>
                </div>

                <div className="py-40 md:py-20 sm-py-10 px-30 md:px-20 sm:px-10">
                  <div className="row y-gap-15 justify-between">
                    <div className="col-auto">
                      <div className="d-flex"></div>
                    </div>
                  </div>

                  {/* Schedule Form - Shown inline instead of a modal */}
                  {/* {showScheduleForm && (
                    <div className="py-30 px-30 bg-light-3 rounded-8 mt-20 mb-20">
                      <h3 className="text-18 fw-500 mb-20">
                        Schedule New Online Class
                      </h3>

                      <form onSubmit={handleScheduleMeeting}>
                        <div className="row y-gap-20">
                          <div className="col-12">
                            <label className="text-14 lh-1 fw-500 mb-10">
                              Class Title
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Enter class title"
                              value={meetingTitle}
                              onChange={(e) => setMeetingTitle(e.target.value)}
                              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
                              disabled={isLoading}
                            />
                          </div>

                          <div className="col-12">
                            <label className="text-14 lh-1 fw-500 mb-10">
                              Course
                            </label>
                            <select
                              value={courseSelection}
                              onChange={(e) => {
                                setCourseSelection(e.target.value);
                                // You would set the courseId based on the selection in a real app
                                // This is just an example
                                switch (e.target.value) {
                                  case "Web Development":
                                    setCourseId(5);
                                    break;
                                  case "UI/UX Design":
                                    setCourseId(2);
                                    break;
                                  case "Digital Marketing":
                                    setCourseId(3);
                                    break;
                                  case "Data Science":
                                    setCourseId(6);
                                    break;
                                  default:
                                    setCourseId(null);
                                }
                              }}
                              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
                              disabled={isLoading}
                            >
                              <option value="All Courses">All Courses</option>
                              <option value="Web Development">
                                Web Development
                              </option>
                              <option value="UI/UX Design">UI/UX Design</option>
                              <option value="Digital Marketing">
                                Digital Marketing
                              </option>
                              <option value="Data Science">Data Science</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="text-14 lh-1 fw-500 mb-10">
                              Date
                            </label>
                            <input
                              type="date"
                              required
                              value={meetingDate}
                              onChange={(e) => setMeetingDate(e.target.value)}
                              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
                              min={new Date().toISOString().split("T")[0]}
                              disabled={isLoading}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="text-14 lh-1 fw-500 mb-10">
                              Time
                            </label>
                            <input
                              type="time"
                              required
                              value={meetingTime}
                              onChange={(e) => setMeetingTime(e.target.value)}
                              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
                              disabled={isLoading}
                            />
                          </div>

                          <div className="col-12">
                            <label className="text-14 lh-1 fw-500 mb-10">
                              Duration (minutes)
                            </label>
                            <select
                              value={meetingDuration}
                              onChange={(e) =>
                                setMeetingDuration(e.target.value)
                              }
                              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
                              disabled={isLoading}
                            >
                              <option value="30">30 minutes</option>
                              <option value="45">45 minutes</option>
                              <option value="60">60 minutes</option>
                              <option value="90">90 minutes</option>
                              <option value="120">120 minutes</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="text-14 lh-1 fw-500 mb-10">
                              Description
                            </label>
                            <textarea
                              placeholder="Enter class description"
                              value={meetingDescription}
                              onChange={(e) =>
                                setMeetingDescription(e.target.value)
                              }
                              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white h-80"
                              disabled={isLoading}
                            ></textarea>
                          </div>

                          <div className="col-12 d-flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowScheduleForm(false)}
                              className="button -md -outlined -purple-1 text-white mr-10"
                              disabled={isLoading}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="button -md -purple-1 text-white"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="d-flex items-center">
                                  <div
                                    className="spinner-border spinner-border-sm mr-10"
                                    role="status"
                                  >
                                    <span className="sr-only">Loading...</span>
                                  </div>
                                  Creating...
                                </div>
                              ) : (
                                "Schedule Class"
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )} */}
                  <ScheduleClassForm />

                  {/* Meeting Detail View - Shown inline instead of a modal */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3">
            <div className="row y-gap-30">
              <EventKeysTwo />

              {/* Upcoming Classes Section */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

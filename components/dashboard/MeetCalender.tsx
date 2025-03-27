"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import PageLinksNew from "@/components/common/PageLinkNew";
import EventCalendarTwo from "./calendar/EventCalendarTwo";
import EventKeysTwo from "./calendar/EventKeysTwo";

// Define TypeScript interfaces for our data
interface Meeting {
  id: string;
  title: string;
  start: string;
  duration: number;
  description: string;
  course: string;
  meetLink: string;
  status: "scheduled" | "live" | "cancelled";
  googleEventId?: string;
  instructorId?: number;
  courseId?: number;
}

export default function MeetCalender() {
  const { user, isLoaded: isUserLoaded } = useUser();

  // State for the form
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [meetingDuration, setMeetingDuration] = useState<string>("60");
  const [meetingDescription, setMeetingDescription] = useState<string>("");
  const [courseSelection, setCourseSelection] = useState<string>("All Courses");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<string>("Monthly");
  const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showDetailView, setShowDetailView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load scheduled meetings from API
  useEffect(() => {
    if (isUserLoaded && user) {
      fetchMeetings();
    }
  }, [isUserLoaded, user]);

  // Fetch meetings from API
  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/meetings");

      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const data = await response.json();

      // Transform the data to match our Meeting interface
      const formattedMeetings: Meeting[] = data.map((meeting: any) => ({
        id: meeting.id.toString(),
        title: meeting.title,
        start: new Date(meeting.startTime).toISOString(),
        duration: meeting.duration,
        description: meeting.description || "",
        course: meeting.course?.title || "No Course",
        meetLink: meeting.meetLink,
        status: meeting.status.toLowerCase(),
        googleEventId: meeting.googleEventId,
        instructorId: meeting.instructorId,
        courseId: meeting.courseId,
      }));

      setScheduledMeetings(formattedMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      // Fallback to localStorage if API fails
      const savedMeetings = localStorage.getItem("scheduledMeetings");
      if (savedMeetings) {
        try {
          const parsedMeetings = JSON.parse(savedMeetings);
          setScheduledMeetings(parsedMeetings as Meeting[]);
        } catch (error) {
          console.error("Error parsing saved meetings:", error);
        }
      }
      toast.error("Failed to load meetings. Using local data instead.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save scheduled meetings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "scheduledMeetings",
      JSON.stringify(scheduledMeetings)
    );
  }, [scheduledMeetings]);

  // Function to create a Google Meet link (in real implementation, use Google Calendar API)
  const createMeetLink = (): string => {
    // Generate a pseudo-unique ID for the meeting
    const meetId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    return `https://meet.google.com/${meetId}`;
  };

  // Handle form submission for new meeting
  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    const meetLink = createMeetLink();
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: meetingTitle,
      start: `${meetingDate}T${meetingTime}`,
      duration: parseInt(meetingDuration),
      description: meetingDescription,
      course: courseSelection,
      meetLink: meetLink,
      status: "scheduled",
    };

    setScheduledMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
    resetForm();
    setShowScheduleForm(false);
  };

  // Function to reset the form
  const resetForm = () => {
    setMeetingTitle("");
    setMeetingDate("");
    setMeetingTime("");
    setMeetingDuration("60");
    setMeetingDescription("");
    setCourseId(null);
    setCourseSelection("All Courses");
  };

  // Open meeting details modal
  const openMeetingDetails = (meetingId: string) => {
    const meeting = scheduledMeetings.find((m) => m.id === meetingId);
    if (meeting) {
      setSelectedMeeting(meeting);
      setShowDetailView(true);
    }
  };

  // Start a meeting
  const startMeeting = async (meetingId: string) => {
    try {
      setIsLoading(true);
      toast.loading("Starting meeting...");

      // Update meeting status in the database
      const response = await fetch("/api/meetings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: meetingId,
          status: "LIVE",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update meeting status");
      }

      // Update local state
      const updatedMeetings = scheduledMeetings.map((meeting) => {
        if (meeting.id === meetingId) {
          return { ...meeting, status: "live" as const };
        }
        return meeting;
      });

      setScheduledMeetings(updatedMeetings);

      // Find the meeting to get its link
      const meeting = scheduledMeetings.find((m) => m.id === meetingId);
      if (meeting) {
        // Open the Google Meet link in a new tab
        window.open(meeting.meetLink, "_blank");
      }

      setShowDetailView(false);
      toast.dismiss();
      toast.success("Meeting started successfully!");
    } catch (error) {
      console.error("Error starting meeting:", error);
      toast.dismiss();
      toast.error("Failed to start meeting. Please try again.");

      // Fallback to local update if API fails
      const updatedMeetings = scheduledMeetings.map((meeting) => {
        if (meeting.id === meetingId) {
          return { ...meeting, status: "live" as const };
        }
        return meeting;
      });

      setScheduledMeetings(updatedMeetings);

      // Find the meeting to get its link
      const meeting = scheduledMeetings.find((m) => m.id === meetingId);
      if (meeting) {
        // Open the Google Meet link in a new tab
        window.open(meeting.meetLink, "_blank");
      }

      setShowDetailView(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a meeting
  const cancelMeeting = async (meetingId: string) => {
    try {
      setIsLoading(true);
      toast.loading("Cancelling meeting...");

      // Update meeting status in the database
      const response = await fetch("/api/meetings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: meetingId,
          status: "CANCELLED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel meeting");
      }

      // Update local state
      const updatedMeetings = scheduledMeetings.map((meeting) => {
        if (meeting.id === meetingId) {
          return { ...meeting, status: "cancelled" as const };
        }
        return meeting;
      });

      setScheduledMeetings(updatedMeetings);
      setShowDetailView(false);

      toast.dismiss();
      toast.success("Meeting cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      toast.dismiss();
      toast.error("Failed to cancel meeting. Please try again.");

      // Fallback to local update if API fails
      const updatedMeetings = scheduledMeetings.map((meeting) => {
        if (meeting.id === meetingId) {
          return { ...meeting, status: "cancelled" as const };
        }
        return meeting;
      });

      setScheduledMeetings(updatedMeetings);
      setShowDetailView(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare events for the calendar
  const calendarEvents = scheduledMeetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    start: meeting.start,
    course: meeting.course,
    status: meeting.status,
  }));

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
                      <div className="d-flex">
                        <div className="">
                          <div
                            id="dd23button"
                            onClick={() => {
                              document
                                .getElementById("dd23button")
                                ?.classList.toggle("-is-dd-active");
                              document
                                .getElementById("dd23content")
                                ?.classList.toggle("-is-el-visible");
                            }}
                            className="dropdown js-dropdown js-category-active"
                          >
                            <div
                              className="dropdown__button d-flex items-center text-14 h-50 rounded-8 px-15 py-10 "
                              data-el-toggle=".js-category-toggle"
                              data-el-toggle-active=".js-category-active"
                            >
                              <span className="js-dropdown-title">
                                {viewMode}
                              </span>
                              <i className="icon text-9 ml-40 icon-chevron-down"></i>
                            </div>

                            <div
                              id="dd23content"
                              className="toggle-element -dropdown -dark-bg-dark-2 -dark-border-white-10 js-click-dropdown js-category-toggle"
                            >
                              <div className="text-14 y-gap-15 js-dropdown-list">
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setViewMode("Monthly");
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    Monthly
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setViewMode("Weekly");
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    Weekly
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setViewMode("Daily");
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    Daily
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="ml-20">
                          <div
                            id="dd24button"
                            onClick={() => {
                              document
                                .getElementById("dd24button")
                                ?.classList.toggle("-is-dd-active");
                              document
                                .getElementById("dd24content")
                                ?.classList.toggle("-is-el-visible");
                            }}
                            className="dropdown js-dropdown js-category-active"
                          >
                            <div
                              className="dropdown__button d-flex items-center text-14 h-50 rounded-8 px-15 py-10 "
                              data-el-toggle=".js-category-toggle"
                              data-el-toggle-active=".js-category-active"
                            >
                              <span className="js-dropdown-title">
                                {courseSelection}
                              </span>
                              <i className="icon text-9 ml-40 icon-chevron-down"></i>
                            </div>

                            <div
                              id="dd24content"
                              className="toggle-element -dropdown -dark-bg-dark-2 -dark-border-white-10 js-click-dropdown js-category-toggle"
                            >
                              <div className="text-14 y-gap-15 js-dropdown-list">
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCourseSelection("All Courses");
                                      setCourseId(null);
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    All Courses
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCourseSelection("Web Development");
                                      setCourseId(5); // Example course ID
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    Web Development
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCourseSelection("UI/UX Design");
                                      setCourseId(2); // Example course ID
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    UI/UX Design
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCourseSelection("Digital Marketing");
                                      setCourseId(3); // Example course ID
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    Digital Marketing
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCourseSelection("Data Science");
                                      setCourseId(6); // Example course ID
                                    }}
                                    className="d-block js-dropdown-link"
                                  >
                                    Data Science
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-auto">
                      <button
                        className="button -md -narrow -purple-1 text-white"
                        onClick={() => {
                          setShowScheduleForm(!showScheduleForm);
                          setShowDetailView(false);
                        }}
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
                            Processing...
                          </div>
                        ) : (
                          <>
                            <i className="icon-calendar-2 mr-10"></i>
                            {showScheduleForm
                              ? "Hide Form"
                              : "Schedule New Class"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Schedule Form - Shown inline instead of a modal */}
                  {showScheduleForm && (
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
                  )}

                  {/* Meeting Detail View - Shown inline instead of a modal */}
                  {showDetailView && selectedMeeting && (
                    <div className="py-30 px-30 bg-light-3 rounded-8 mt-20 mb-20">
                      <div className="d-flex justify-between items-center mb-20">
                        <h3 className="text-18 fw-500">Class Details</h3>
                        <button
                          onClick={() => setShowDetailView(false)}
                          disabled={isLoading}
                          className="size-40 rounded-full d-flex justify-center items-center"
                        >
                          <i className="icon-close text-15"></i>
                        </button>
                      </div>

                      <div className="row y-gap-20">
                        <div className="col-12">
                          <div className="d-flex justify-between">
                            <h4 className="text-18 fw-500">
                              {selectedMeeting.title}
                            </h4>
                            <div
                              className={`badge ${
                                selectedMeeting.status === "live"
                                  ? "badge-green"
                                  : selectedMeeting.status === "cancelled"
                                  ? "badge-red"
                                  : "badge-purple"
                              }`}
                            >
                              {selectedMeeting.status === "live"
                                ? "Live"
                                : selectedMeeting.status === "cancelled"
                                ? "Cancelled"
                                : "Scheduled"}
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="text-14 lh-1 fw-500">Course:</div>
                          <div className="text-14 mt-5">
                            {selectedMeeting.course}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="text-14 lh-1 fw-500">
                            Date & Time:
                          </div>
                          <div className="text-14 mt-5">
                            {new Date(
                              selectedMeeting.start
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(selectedMeeting.start).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="text-14 lh-1 fw-500">Duration:</div>
                          <div className="text-14 mt-5">
                            {selectedMeeting.duration} minutes
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="text-14 lh-1 fw-500">
                            Description:
                          </div>
                          <div className="text-14 mt-5">
                            {selectedMeeting.description ||
                              "No description provided."}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="text-14 lh-1 fw-500">
                            Google Meet Link:
                          </div>
                          <div className="text-14 mt-5">
                            <a
                              href={selectedMeeting.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-1"
                            >
                              {selectedMeeting.meetLink}
                            </a>
                          </div>
                        </div>

                        <div className="col-12 mt-10 d-flex justify-end">
                          {selectedMeeting.status !== "cancelled" && (
                            <>
                              <button
                                onClick={() =>
                                  cancelMeeting(selectedMeeting.id)
                                }
                                className="button -md -outlined -red-1 text-red-1 mr-10"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="d-flex items-center">
                                    <div
                                      className="spinner-border spinner-border-sm mr-10"
                                      role="status"
                                    >
                                      <span className="sr-only">
                                        Loading...
                                      </span>
                                    </div>
                                    Processing...
                                  </div>
                                ) : (
                                  "Cancel Class"
                                )}
                              </button>
                              <button
                                onClick={() => startMeeting(selectedMeeting.id)}
                                disabled={
                                  isLoading || selectedMeeting.status === "live"
                                }
                                className={`button -md ${
                                  selectedMeeting.status === "live"
                                    ? "-dark-1"
                                    : "-green-1"
                                } text-white`}
                              >
                                {isLoading ? (
                                  <div className="d-flex items-center">
                                    <div
                                      className="spinner-border spinner-border-sm mr-10"
                                      role="status"
                                    >
                                      <span className="sr-only">
                                        Loading...
                                      </span>
                                    </div>
                                    Processing...
                                  </div>
                                ) : selectedMeeting.status === "live" ? (
                                  "Class is Live"
                                ) : (
                                  "Start Class"
                                )}
                              </button>
                            </>
                          )}
                          {selectedMeeting.status === "cancelled" && (
                            <div className="text-14 text-red-1">
                              This class has been cancelled
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-scroll scroll-bar-1 mt-20">
                    {isLoading && scheduledMeetings.length === 0 ? (
                      <div className="d-flex justify-center items-center py-50">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <EventCalendarTwo
                        events={calendarEvents}
                        viewMode={viewMode.toLowerCase()}
                        onEventClick={(meetingId) => {
                          openMeetingDetails(meetingId);
                          setShowScheduleForm(false);
                          setShowDetailView(true);
                        }}
                      />
                    )}
                  </div>

                  <div className="row x-gap-20 y-gap-10 justify-center pt-30">
                    <div className="col-auto">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Export calendar functionality could be implemented here
                          toast.success(
                            "Export functionality would be implemented here"
                          );
                        }}
                        className="button -icon -purple-3 text-light-1"
                      >
                        Export Calendar
                        <i className="icon-arrow-top-right text-13 ml-10"></i>
                      </a>
                    </div>
                    <div className="col-auto">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Google Calendar sync could be implemented here
                          toast.success(
                            "Google Calendar sync would be implemented here"
                          );
                        }}
                        className="button -icon -purple-3 text-light-1"
                      >
                        Sync with Google Calendar
                        <i className="icon-arrow-top-right text-13 ml-10"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3">
            <div className="row y-gap-30">
              <EventKeysTwo />

              {/* Upcoming Classes Section */}
              <div className="col-12">
                <div className="pt-20 pb-30 px-30 rounded-16 bg-white -dark-bg-dark-1 shadow-4">
                  <h5 className="text-17 fw-500 mb-30">Upcoming Classes</h5>

                  {isLoading && scheduledMeetings.length === 0 ? (
                    <div className="d-flex justify-center items-center py-30">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : scheduledMeetings.filter(
                      (meeting) =>
                        meeting.status !== "cancelled" &&
                        new Date(meeting.start) > new Date()
                    ).length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-14">No upcoming classes</p>
                      <button
                        onClick={() => {
                          setShowScheduleForm(true);
                          setShowDetailView(false);
                        }}
                        className="button -sm -purple-1 text-white mt-10"
                      >
                        Schedule a Class
                      </button>
                    </div>
                  ) : (
                    scheduledMeetings
                      .filter(
                        (meeting) =>
                          meeting.status !== "cancelled" &&
                          new Date(meeting.start) > new Date()
                      )
                      .sort(
                        (a, b) =>
                          new Date(a.start).getTime() -
                          new Date(b.start).getTime()
                      )
                      .slice(0, 5)
                      .map((meeting, index) => (
                        <div
                          key={index}
                          className="d-flex items-center py-10 border-bottom-light"
                        >
                          <div className="mr-15">
                            <div className="d-flex justify-center items-center size-35 rounded-8 bg-purple-1">
                              <div className="icon-play text-white"></div>
                            </div>
                          </div>
                          <div>
                            <div className="text-14 lh-1 fw-500 text-dark-1">
                              {meeting.title}
                            </div>
                            <div className="text-13 lh-1 mt-5">
                              {new Date(meeting.start).toLocaleDateString()} •{" "}
                              {new Date(meeting.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="d-flex items-center mt-5">
                              <button
                                onClick={() => {
                                  openMeetingDetails(meeting.id);
                                  setShowScheduleForm(false);
                                  setShowDetailView(true);
                                }}
                                className="text-12 lh-1 text-purple-1 underline"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

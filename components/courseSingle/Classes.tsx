"use client";

import type { Meeting } from "@prisma/client";

interface ClassesProps {
    meetings: Meeting[];
}

// Dummy data for preview - remove this when real data is available
const getDummyMeetings = (): Meeting[] => {
    const now = new Date();

    return [
        {
            id: 1,
            title: "Introduction to the Course",
            description: "Overview of course structure, learning objectives, and Q&A session",
            startTime: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 mins ago (ongoing)
            duration: 90,
            meetLink: "https://meet.google.com/abc-defg-hij",
            status: "LIVE",
            courseId: 1,
            instructorId: 1,
            googleEventId: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 2,
            title: "Deep Dive: Core Concepts",
            description: "Detailed explanation of fundamental concepts with practical examples",
            startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            duration: 60,
            meetLink: "https://meet.google.com/klm-nopq-rst",
            status: "SCHEDULED",
            courseId: 1,
            instructorId: 1,
            googleEventId: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 3,
            title: "Hands-on Workshop",
            description: "Interactive session with coding exercises and live debugging",
            startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            duration: 120,
            meetLink: "https://meet.google.com/uvw-xyza-bcd",
            status: "SCHEDULED",
            courseId: 1,
            instructorId: 1,
            googleEventId: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 4,
            title: "Advanced Topics & Best Practices",
            description: "Industry best practices and advanced techniques",
            startTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
            duration: 75,
            meetLink: "https://meet.google.com/efg-hijk-lmn",
            status: "SCHEDULED",
            courseId: 1,
            instructorId: 1,
            googleEventId: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 5,
            title: "Welcome Session",
            description: "Initial meet and greet with all enrolled students",
            startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (ended)
            duration: 45,
            meetLink: "https://meet.google.com/opq-rstu-vwx",
            status: "SCHEDULED",
            courseId: 1,
            instructorId: 1,
            googleEventId: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 6,
            title: "Q&A Session: Module 1",
            description: "Doubt clearing session for the first module",
            startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago (ended)
            duration: 60,
            meetLink: "https://meet.google.com/yza-bcde-fgh",
            status: "SCHEDULED",
            courseId: 1,
            instructorId: 1,
            googleEventId: null,
            createdAt: now,
            updatedAt: now,
        },
    ] as Meeting[];
};

// Helper to determine class status based on time
function getClassStatus(startTime: Date, durationMinutes: number): "upcoming" | "ongoing" | "ended" {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    if (now < start) {
        return "upcoming";
    } else if (now >= start && now <= end) {
        return "ongoing";
    } else {
        return "ended";
    }
}

// Format date and time for display
function formatDateTime(date: Date): { date: string; time: string } {
    const d = new Date(date);
    return {
        date: d.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
        time: d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
}

// Format duration
function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function Classes({ meetings }: ClassesProps) {
    // Use dummy data if no real meetings exist
    const displayMeetings = meetings.length > 0 ? meetings : getDummyMeetings();

    // Separate classes by status
    const classifiedMeetings = displayMeetings.map((meeting) => ({
        ...meeting,
        status: getClassStatus(meeting.startTime, meeting.duration),
    }));

    const ongoing = classifiedMeetings.filter((m) => m.status === "ongoing");
    const upcoming = classifiedMeetings.filter((m) => m.status === "upcoming");
    const ended = classifiedMeetings.filter((m) => m.status === "ended");

    // Sort upcoming by start time (earliest first)
    upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    // Sort ended by start time (most recent first)
    ended.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const renderClassCard = (
        meeting: (typeof classifiedMeetings)[0],
        showJoinButton = false
    ) => {
        const { date, time } = formatDateTime(meeting.startTime);
        const statusColors = {
            ongoing: "bg-green-1 text-white",
            upcoming: "bg-blue-1 text-white",
            ended: "bg-light-4 text-dark-1",
        };

        return (
            <div
                key={meeting.id}
                className="py-20 px-25 border-light rounded-8 mb-15"
                style={{ backgroundColor: "#fafafa" }}
            >
                <div className="d-flex justify-between items-start">
                    <div className="flex-grow-1">
                        <div className="d-flex items-center gap-10 mb-10">
                            <h4 className="text-17 fw-500 text-dark-1">{meeting.title}</h4>
                            <span
                                className={`badge px-10 py-4 text-11 rounded-4 ${statusColors[meeting.status]}`}
                            >
                                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                            </span>
                        </div>

                        {meeting.description && (
                            <p className="text-14 text-light-1 mb-10">{meeting.description}</p>
                        )}

                        <div className="d-flex flex-wrap x-gap-20 y-gap-10">
                            <div className="d-flex items-center">
                                <i className="icon-calendar text-16 mr-8 text-purple-1"></i>
                                <span className="text-14 text-dark-1">{date}</span>
                            </div>
                            <div className="d-flex items-center">
                                <i className="icon-time text-16 mr-8 text-purple-1"></i>
                                <span className="text-14 text-dark-1">{time}</span>
                            </div>
                            <div className="d-flex items-center">
                                <i className="icon-clock text-16 mr-8 text-purple-1"></i>
                                <span className="text-14 text-dark-1">
                                    {formatDuration(meeting.duration)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {showJoinButton && meeting.meetLink && (
                        <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button -sm -purple-1 text-white ml-20"
                        >
                            Join Class
                        </a>
                    )}
                </div>
            </div>
        );
    };

    const renderSection = (
        title: string,
        items: typeof classifiedMeetings,
        showJoinButton = false,
        emptyMessage: string
    ) => (
        <div className="mb-30">
            <h3 className="text-18 fw-500 text-dark-1 mb-15">{title}</h3>
            {items.length > 0 ? (
                items.map((meeting) => renderClassCard(meeting, showJoinButton))
            ) : (
                <p className="text-14 text-light-1 py-15">{emptyMessage}</p>
            )}
        </div>
    );

    return (
        <div id="classes" className="pt-30">
            <h2 className="text-20 fw-500 mb-20">Live Classes</h2>

            {displayMeetings.length === 0 ? (
                <div className="py-30 text-center">
                    <i className="icon-video-camera text-40 text-light-1 mb-15"></i>
                    <p className="text-16 text-light-1">
                        No classes scheduled for this course yet.
                    </p>
                </div>
            ) : (
                <>
                    {renderSection(
                        "🔴 Ongoing Classes",
                        ongoing,
                        true,
                        "No classes happening right now."
                    )}
                    {renderSection(
                        "📅 Upcoming Classes",
                        upcoming,
                        true,
                        "No upcoming classes scheduled."
                    )}
                    {renderSection(
                        "✓ Past Classes",
                        ended,
                        false,
                        "No past classes."
                    )}
                </>
            )}
        </div>
    );
}

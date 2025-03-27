import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Default events if none are provided
const defaultEvents = [
  { title: "Birthday Party", start: new Date() },
  { title: "Group Project is due", start: new Date() },
];

// Define types for the component props
interface EventCalendarTwoProps {
  events?: any[];
  viewMode?: string;
  onEventClick?: (meetingId: string) => void;
}

function renderEventContent(eventInfo: any) {
  const statusColor =
    eventInfo.event.extendedProps.status === "live"
      ? "bg-green-1"
      : eventInfo.event.extendedProps.status === "cancelled"
      ? "bg-red-1"
      : "bg-purple-1";

  return (
    <>
      {/* <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i> */}
      <div
        className="text-left pt-5 pb-15 px-10"
        style={{ overflow: "hidden" }}
      >
        <div className={"mt-5"}>
          <div className={`text-14 dot-left ml-5 ${statusColor}`}>
            {eventInfo.timeText}
          </div>
          <div className="text-14 text-dark-1 break-content">
            {eventInfo.event.title}
          </div>
          {eventInfo.event.extendedProps.course && (
            <div className="text-12 lh-1 mt-5 text-purple-1">
              {eventInfo.event.extendedProps.course}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function EventCalendarTwo({
  events = defaultEvents,
  viewMode = "dayGridMonth",
  onEventClick,
}: EventCalendarTwoProps) {
  // Map the viewMode string to the appropriate FullCalendar view
  const getViewMode = () => {
    switch (viewMode.toLowerCase()) {
      case "weekly":
        return "timeGridWeek";
      case "daily":
        return "timeGridDay";
      case "monthly":
      default:
        return "dayGridMonth";
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={getViewMode()}
        events={events}
        eventContent={renderEventContent}
        headerToolbar={false}
        eventClick={(info) => {
          if (onEventClick) {
            onEventClick(info.event.id || info.event.extendedProps.id);
          }
        }}
      />
    </div>
  );
}

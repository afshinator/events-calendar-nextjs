"use client";

import React, { useState, useEffect } from "react";

import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);


  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };


  const handleEventClick = (selected: EventClickArg) => {
    console.log('got an event ', selected)


    // Prompt user for confirmation before deleting an event
    if (
      window.confirm(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      selected.event.remove();
    }
  };



  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
console.log('got an AddEvent ', e)


    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div className="flex w-full px-10 justify-start items-start gap-8">
      <div className="w-3/12">
        <div className="py-10 text-2xl font-extrabold px-7">
          Calendar Events
        </div>

        <ul className="space-y-4">
          {currentEvents.length <= 0 && (
            <div className="italic text-center text-gray-400">
              No Events Present
            </div>
          )}

          {currentEvents.length > 0 &&
            currentEvents.map((event: EventApi) => (
              <li
                className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                key={event.id}
              >
                {event.title}
                <br />
                <label className="text-slate-950">
                  {formatDate(event.start!, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {/* Format event start date */}
                </label>
              </li>
            ))}
        </ul>


      </div>
      <div className="w-9/12 mt-8">
        <FullCalendar
          height={"85vh"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Initialize calendar with required plugins.
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }} // Set header toolbar options.
          initialView="dayGridMonth" // Initial view mode of the calendar.
          editable={true} // Allow events to be edited.
          selectable={true} // Allow dates to be selectable.
          selectMirror={true} // Mirror selections visually.
          dayMaxEvents={true} // Limit the number of events displayed per day.
          select={handleDateClick} // Handle date selection to create new events.
          eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
          eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
          initialEvents={
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("events") || "[]")
              : []
          } // Initial events loaded from local storage.
        />
      </div>
    </div>
  )
}

export default Calendar
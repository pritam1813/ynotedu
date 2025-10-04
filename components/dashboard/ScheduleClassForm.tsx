"use client";
import React, { useActionState, useEffect } from "react";
import { createClass } from "@/app/actions/scheduleClassActions";
import { toast } from "react-hot-toast";

const initialState = {
  success: false,
  message: "",
};

export default function ScheduleClassForm() {
  const [state, formAction, pending] = useActionState(
    createClass,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message !== "") toast.success(state.message);
    if (!state.success && state.message !== "") toast.error(state.message);
  }, [state]);

  return (
    <div className="py-30 px-30 bg-light-3 rounded-8 mt-20 mb-20">
      <h3 className="text-18 fw-500 mb-20">Schedule New Online Class</h3>

      <form action={formAction}>
        <div className="row y-gap-20">
          <div className="col-12">
            <label className="text-14 lh-1 fw-500 mb-10">Class Title</label>
            <input
              type="text"
              required
              placeholder="Enter class title"
              name="title"
              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
            />
          </div>

          <div className="col-12">
            <label className="text-14 lh-1 fw-500 mb-10">Subject</label>
            <input
              type="text"
              required
              placeholder="Enter Subject or Topic"
              name="subject"
              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
            />
          </div>

          <div className="col-md-6">
            <label className="text-14 lh-1 fw-500 mb-10">Date</label>
            <input
              type="date"
              name="date"
              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col-md-6">
            <label className="text-14 lh-1 fw-500 mb-10">Time</label>
            <input
              type="time"
              name="time"
              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
            />
          </div>

          <div className="col-12">
            <label className="text-14 lh-1 fw-500 mb-10">
              Duration (minutes)
            </label>
            <select
              name="duration"
              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white"
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
              Online Class Link
            </label>
            <input
              type="url"
              placeholder="Enter Meeting Link"
              name="meetlink"
              className="w-1/1 px-15 py-12 rounded-8 border-light bg-white h-80"
            ></input>
          </div>

          <div className="col-12 d-flex justify-end">
            {/* <button
              type="button"
              className="button -md -outlined -purple-1 text-white mr-10"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="button -md -purple-1 text-white"
              disabled={pending}
            >
              {pending ? "Creating..." : "Schedule Class"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

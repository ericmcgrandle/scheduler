import React from "react";

import "components/Application.scss";
import DayList from "components/DayList"
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    deleteAppointment,
  } = useApplicationData();

  //helper functions
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  
  //map appointments
  const mapAppointment = dailyAppointments.map(appointment => {
    return (
      <Appointment 
      key={appointment.id} 
      {...appointment}
      interviewers={dailyInterviewers}
      bookInterview={bookInterview}
      deleteAppointment={deleteAppointment}
      />
    )
  });

  //main component
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {mapAppointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList"
import { Confirm, Empty, Err, Form, Header, Show, Status } from "components/Appointment"
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay } from "helpers/selectors";


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  
  const setDay = day => setState({ ...state, day });

  //get days from api
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {    
      const days = all[0].data;
      const appointments = all[1].data;
      console.log('appointments :', appointments);
      const interviewers = all[2].data;
      console.log('interviewer :', interviewers);
      setState(prev => ({ ...prev, days, appointments, interviewers }))
    });
  }, []);

  console.log('state', state.interviewers);

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  

  //map appointments
  const mapAppointment = dailyAppointments.map(appointment => {
    // const interview = getInterview(state, appointment.interview);

    return (
      <Appointment 
      key={appointment.id} 
      {...appointment} />
    )
  });


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
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}

import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList"
import { Confirm, Empty, Err, Form, Header, Show, Status } from "components/Appointment"
import Appointment from "components/Appointment/index";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Eric McGrandle",
      interviewer: {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      }
    }
  },
  {
    id: 4,
    time: "4pm",
  },
  {
    id: 5,
    time: "5pm",
    interview: {
      student: "John Doe",
      interviewer: {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  }
];



export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  
  const setDay = day => setState({ ...state, day });
  const setDays = days => setState({ ...state, days });

  //get days from api
  useEffect(() => {
    axios.get('/api/days')
      .then((res) => {
        const days = res.data;
        setState(prev => ({ ...prev, days }));
      })
  }, []);
  

  //map appointments
  const mapAppointment = appointments.map(appointment => {
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

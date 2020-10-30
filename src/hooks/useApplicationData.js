import { useState, useEffect } from 'react';
import axios from 'axios';
import getIndex from 'helpers/updateSpots'

export default function useApplicationData() {

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
      const interviewers = all[2].data;
      setState(prev => ({ ...prev, days, appointments, interviewers }))
    });
  }, []);

  function bookInterview(id, interview) {

    //get local state
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    //updating state data
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        const index = getIndex(state);
        const spots = (state.days[index].spots - 1);
        const arr = [...state.days];
        arr[index].spots = spots;

        setState({
          ...state,
          appointments,
          days: arr
        });
      })
    }

    function deleteAppointment(id) {
      //get local state data
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      //updating state data
      return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        const index = getIndex(state);
        const spots = (state.days[index].spots + 1);
        const arr = [...state.days];
        arr[index].spots = spots;

        setState({
          ...state,
          appointments,
          days: arr
        });
      })
    };

    return {state, setDay, bookInterview, deleteAppointment }
}
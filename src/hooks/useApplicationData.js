import { useEffect, useReducer } from 'react';
import axios from 'axios';
import getIndex from 'helpers/updateSpots'

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function reducer(state, action) {

    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value
        }
      case SET_APPLICATION_DATA:
        return { 
          ...state,
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers,
          }
      case SET_INTERVIEW: {
        return {
          ...state,
          days: action.value.days,
          appointments: action.value.appointments,
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = day => dispatch({ type: SET_DAY, value: day })

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
      dispatch({ type: SET_APPLICATION_DATA, value: 
        {
          days: days,
          appointments: appointments,
          interviewers: interviewers
        }
      })
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

        dispatch({ type: SET_INTERVIEW, value: 
          {
            ...state,
            appointments: appointments,
            days: arr
          } 
        })
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

        dispatch({ type: SET_INTERVIEW, value: 
          {
            ...state,
            appointments: appointments,
            days: arr
          } 
        })
      })
    };

    return {state, setDay, bookInterview, deleteAppointment }
}
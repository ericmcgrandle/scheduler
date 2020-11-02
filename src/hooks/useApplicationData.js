import { useEffect, useReducer } from 'react';
import axios from 'axios';
import updateDaysArray from "helpers/updateSpots";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";


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

      const newDaysArray = updateDaysArray(action.value.interview, action.value.id, state);
      
       //get local state
      const appointment = {
        ...state.appointments[action.value.id],
        interview: action.value.interview
      };
      const appointments = {
        ...state.appointments,
        [action.value.id]: appointment
      };

      return {
        ...state,
        appointments: appointments,
        days: newDaysArray
      }
    }
      
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = function(event) {
      
      //Recieve message from server
      webSocket.onmessage = function(event) {
        //serialize data
        const data = JSON.parse(event.data);
        const id = data.id;
        const interview = data.interview;

        //Check if trying to update interview
        if (data.type === "SET_INTERVIEW") {
          dispatch({ type: SET_INTERVIEW, value: 
            {
              id,
              interview
            } 
          })
        } else {
          console.log('message recieved', data);
        }
      }
    }
  }, []);

  
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
    //updating state data
    return axios.put(`/api/appointments/${id}`, { interview })
      .catch((err) => {
        console.log('error', err);
      })
    }

    function deleteAppointment(id) {
      //updating state data
      return axios.delete(`/api/appointments/${id}`)
      .catch((err) => {
        console.log('error', err);
      })
    };

    return {state, setDay, bookInterview, deleteAppointment }
}


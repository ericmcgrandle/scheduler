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
      //update spots remaining
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
        webSocket.onmessage = function(event) {
        //serialize data
        const data = JSON.parse(event.data);
        if (data.type === "SET_INTERVIEW") {
          //COMMENT OUT IF NEEDED FOR TEST FILE
          dispatch({ type: SET_INTERVIEW, value: 
            {
              id: data.id,
              interview: data.interview
            } 
          })
        } 
      }
    }
  }, []);

  
  const setDay = day => dispatch({ type: SET_DAY, value: day })

   //update state from server
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
    return axios.put(`/api/appointments/${id}`, { interview })
    /*
      // ONLY USE THIS THEN FOR 2ND TEST IN APPLICATION.TEST.JS
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: 
          {
            id: id,
            interview: interview
          } 
        })
      })
    */
    }

    function deleteAppointment(id) {
      return axios.delete(`/api/appointments/${id}`)
    /* 
      //ONLY USE THIS THEN FOR 2ND TEST IN APPLICATION.TEST.JS
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: 
          {
            id: id,
            interview: null
          } 
        })
      })
    */  
    };
    return {state, setDay, bookInterview, deleteAppointment }
}


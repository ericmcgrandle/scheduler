import { useEffect, useReducer } from 'react';
import axios from 'axios';
import getIndex from "helpers/updateSpots";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";


function reducer(state, action) {
  console.log('top of reducer');

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

      const arr = [...state.days];
      //if adding interview else deleting interview
      if (action.value.interview) {
        const index = getIndex(state);
        const spots = state.days[index].spots - 1;
        arr[index].spots = spots;
      } else {
        const index = getIndex(state);
        const spots = state.days[index].spots + 1;
        arr[index].spots = spots;
      }
      
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
        days: arr
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
     console.log('calling apis');
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
      .then((res) => {
        console.log('in book interview then');
      })
    }

    function deleteAppointment(id) {
      //updating state data
      return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        console.log('in delete interview then');
      })
    };

    return {state, setDay, bookInterview, deleteAppointment }
}


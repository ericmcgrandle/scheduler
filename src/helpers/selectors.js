export function getAppointmentsForDay(state, day) {

  const result = [];

  const filtered = state.days.filter((elem) => elem.name === day);
  //if empty
  if (filtered.length === 0) {
    return result;
  }

  const appointmentsArr = filtered[0].appointments;
  for (let key in state.appointments) {
    if (appointmentsArr.includes(Number(key))) {
      result.push(state.appointments[key]);
    }
  }
  return result;
};

export function getInterviewersForDay(state, day) {
  const result = [];

  const filtered = state.days.filter((elem) => elem.name === day);
  //if empty
  if (filtered.length === 0) {
    return result;
  }

  const interviewersArr = filtered[0].interviewers;
  for (let key in state.interviewers) {
    if (interviewersArr.includes(Number(key))) {
      result.push(state.interviewers[key]);
    }
  }
  return result;
};


export function getInterview(state, interview) {
  
  if (!interview) {
    return null;
  }
  
  const id = interview.interviewer;
  let student = "";
  let interviewObj = {};

  for (let data in state.appointments) {
    if (state.appointments[data].interview) {
      if (state.appointments[data].interview.interviewer === id) {
        student = state.appointments[data].interview.student;
      }
    }
  }

  for (let data in state.interviewers) {
    if (state.interviewers[data].id === id) {
      interviewObj = state.interviewers[data];
    }
  }

  return { 
    student,
    interviewer: interviewObj
  };
};
export default function updateDaysArray(interview, appointmentId, state) {

  const appointment = state.appointments[appointmentId];
  const prevState = appointment.interview;

  //using appointment id find dayIndex and current spots for day
  let dayIndex = 0;
  let daySpots = 0;
  for (let dayObj of state.days) {
    if (dayObj.appointments.includes(appointmentId)) {
      dayIndex = dayObj.id - 1;
      daySpots = dayObj.spots;
    }
  }

  //update the spots using a copy of state.days 
  const stateDaysArrayCopy = [...state.days];
  if (interview && (prevState === null)) {
    //ADDING APPOINTMENT
    stateDaysArrayCopy[dayIndex].spots = daySpots - 1;
  } else if (prevState && interview === null) {
    //DELETING APPOINTMENT
    stateDaysArrayCopy[dayIndex].spots = daySpots + 1;
  }

  return stateDaysArrayCopy

}
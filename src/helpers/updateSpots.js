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
    const newSpots = daySpots - 1;
    stateDaysArrayCopy[dayIndex] = {...stateDaysArrayCopy[dayIndex], spots: newSpots};
  } else if (prevState && interview === null) {
    //DELETING APPOINTMENT
    const newSpots = daySpots + 1;
    stateDaysArrayCopy[dayIndex] = {...stateDaysArrayCopy[dayIndex], spots: newSpots};
  }

  return stateDaysArrayCopy

}
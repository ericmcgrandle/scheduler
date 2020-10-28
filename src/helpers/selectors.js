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
}
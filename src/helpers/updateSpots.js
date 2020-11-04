export default function updateDaysArray(state, appointments) {

  const remainingSpots = (day) => {
    let spots = 0; 
    for (let id of day.appointments) {
      if (appointments[id].interview === null) {
        spots++;
      }
    }
    return spots;
  }

  const days = state.days.map(day => {
    let newSpotsRemaining = remainingSpots(day);
    return { ...day, spots: newSpotsRemaining }
  });

  return days;
};
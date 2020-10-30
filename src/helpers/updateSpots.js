export default function getIndex(state) {
  for (let elem of state.days) {
    if (elem.name === state.day) {
      return (elem.id - 1)
    }
  }
}




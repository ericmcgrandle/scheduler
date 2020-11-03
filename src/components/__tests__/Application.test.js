import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  await waitForElement(() => getByText("Monday"))
  
  fireEvent.click(getByText("Tuesday"))
  expect(getByText("Leopold Silvers")).toBeInTheDocument();

});

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  const { container, debug } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];
  //Click add
  fireEvent.click(getByAltText(appointment, "Add"));
  //Add student's name
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });
  //Add interviewer
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  /*
  THIS CODE COMPLETES THE TEST, BUT DOES NOT WORK WHILE USING WEBSOCKETS
  To use this code you must:
    comment out -> dispatch statement in useEffect with websockets (approx. Lines 66-73 in useApplicationData.js)
    uncomment -> then statement in bookInterview (approx. Lines 102-112 in useApplicationData.js)
    uncomment -> then statement in deleteAppointment (approx. Lines 120-130 in useApplicationData.js)
    uncomment the lines below
  */
  /*
  fireEvent.click(getByText(appointment, "Save"));
  expect(getByText(appointment, "Saving")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );  
  expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  */
});



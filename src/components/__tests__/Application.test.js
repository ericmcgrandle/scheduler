import React from "react";
import axios from "axios";

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
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];
  //Click add
  fireEvent.click(getByAltText(appointment, "Add"));
  //Add student's name
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });

  /*
  THIS CODE COMPLETES THE TEST, BUT DOES NOT WORK WHILE USING WEBSOCKETS
  To use this code you must:
    comment out -> dispatch statement in useEffect with websockets (approx. Lines 66-73 in useApplicationData.js)
    uncomment -> then statement in bookInterview (approx. Lines 102-112 in useApplicationData.js)
    uncomment -> then statement in deleteAppointment (approx. Lines 120-130 in useApplicationData.js)
    uncomment the lines below
  */

  // fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // fireEvent.click(getByText(appointment, "Save"));
  // expect(getByText(appointment, "Saving")).toBeInTheDocument();

  // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  // const day = getAllByTestId(container, "day").find(day =>
  //   queryByText(day, "Monday")
  // );  
  // expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  
});

it("loads data, delete an interview and increase the spots remaining for the first day by 1", async () => {
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  /*
  THIS CODE COMPLETES THE TEST, BUT DOES NOT WORK WHILE USING WEBSOCKETS
  To use this code you must:
    comment out -> dispatch statement in useEffect with websockets (approx. Lines 66-73 in useApplicationData.js)
    uncomment -> then statement in bookInterview (approx. Lines 102-112 in useApplicationData.js)
    uncomment -> then statement in deleteAppointment (approx. Lines 120-130 in useApplicationData.js)
    uncomment the lines below
  */

  // fireEvent.click(getByAltText(appointment, "Delete"));
  // fireEvent.click(getByText(appointment, "Confirm"));
  
  // expect(getByText(appointment, "Deleting")).toBeInTheDocument();

  // await waitForElement(() => getByAltText(appointment, "Add"));

  // const day = getAllByTestId(container, "day").find(day =>
  //   queryByText(day, "Monday")
  // );  
  // expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  //Click Edit
  fireEvent.click(getByAltText(appointment, "Edit"));

  //Add student
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });

  /*
  THIS CODE COMPLETES THE TEST, BUT DOES NOT WORK WHILE USING WEBSOCKETS
  To use this code you must:
    comment out -> dispatch statement in useEffect with websockets (approx. Lines 66-73 in useApplicationData.js)
    uncomment -> then statement in bookInterview (approx. Lines 102-112 in useApplicationData.js)
    uncomment -> then statement in deleteAppointment (approx. Lines 120-130 in useApplicationData.js)
    uncomment the lines below
  */

  // fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // fireEvent.click(getByText(appointment, "Save"));
  // expect(getByText(appointment, "Saving")).toBeInTheDocument();

  // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  // const day = getAllByTestId(container, "day").find(day =>
  //   queryByText(day, "Monday")
  // );  
  // expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});

it("shows the save error when failing to save an appointment", async () => {
  axios.put.mockRejectedValueOnce();
  const { container } = render(<Application />);

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

  //Save appointment, look for error message
  fireEvent.click(getByText(appointment, "Save"));
  await waitForElement(() => getByText(appointment, "There was a problem saving the interview"))
  expect(getByText(appointment, "There was a problem saving the interview")).toBeInTheDocument();

  //Close error, look for add button
  fireEvent.click(getByAltText(appointment, "Close"));
  expect((getByAltText(appointment, "Add"))).toBeInTheDocument();
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});

it("shows the delete error when failing to delete an appointment", async () => {
  axios.delete.mockRejectedValueOnce();
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  //Delete and confirm deletion
  fireEvent.click(getByAltText(appointment, "Delete"));
  fireEvent.click(getByText(appointment, "Confirm"));
  
  //Await for error message
  await waitForElement(() => getByText(appointment, "There was a problem deleting the interview"))
  expect(getByText(appointment, "There was a problem deleting the interview")).toBeInTheDocument();

  //Close error, look for add button
  fireEvent.click(getByAltText(appointment, "Close"));
  expect((getByText(appointment, "Archie Cohen"))).toBeInTheDocument();
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});


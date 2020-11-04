import React from "react";
import axios from "axios";
import WS from 'jest-websocket-mock';

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  await waitForElement(() => getByText("Monday"))
  
  fireEvent.click(getByText("Tuesday"))
  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  const server = new WS("ws://localhost:8001");
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

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));
  expect(getByText(appointment, "Saving")).toBeInTheDocument();

  //Mock server data
  server.send(`{"type": "SET_INTERVIEW", "id": 1, "interview": {"interviewer": 1, "student": "Lydia Miller-Jones"}}`);

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"), {exact: false});

  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );  
  expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  server.close();
});

it("loads data, delete an interview and increase the spots remaining for the first day by 1", async () => {
  const server = new WS("ws://localhost:8001");
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(getByAltText(appointment, "Delete"));
  fireEvent.click(getByText(appointment, "Confirm"));
  
  expect(getByText(appointment, "Deleting")).toBeInTheDocument();

  //Mock server data
  server.send(`{"type": "SET_INTERVIEW", "id": 2, "interview": null }`);


  await waitForElement(() => getByAltText(appointment, "Add"));

  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );  
  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  server.close();
});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  const server = new WS("ws://localhost:8001");
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

  
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));
  expect(getByText(appointment, "Saving")).toBeInTheDocument();

  //Mock server data
  server.send(`{"type": "SET_INTERVIEW", "id": 2, "interview": {"interviewer": 1, "student": "Lydia Miller-Jones"}}`);

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"), {exact: false});

  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );  
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  
  server.close();
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


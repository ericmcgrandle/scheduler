import React, { Fragment } from "react";

//css
import "components/Appointment/styles.scss";

//js
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"

import useVisualMode from "hooks/useVisualMode"
import Confirm from "./Confirm";


export default function Appointment(props) {
  //constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //Save appointment
  function save(name, interviewer) {
    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    })
  };

  //Delete appointment
  function remove() {
    transition(CONFIRM) 
  };
  function deleteAppointment() {
    transition(DELETING);
    props.deleteAppointment(props.id)
    .then(() => {
      transition(EMPTY);
    })
  }

  //Edit appointment
  function edit() {
    transition(EDIT)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onDelete={remove}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving"
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you'd like to delete?"
          onCancel={() => back()}
          onConfirm={deleteAppointment}  
        />
      )}
      {mode === DELETING &&  (
        <Status
          message="Deleting"
        /> 
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      
    </article>
    
  )

}
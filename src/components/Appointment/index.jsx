import React, { useEffect } from "react";

//css
import "components/Appointment/styles.scss";

//components
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Err from "components/Appointment/Error"
import Confirm from "components/Appointment/Confirm";
//hooks
import useVisualMode from "hooks/useVisualMode"

export default function Appointment(props) {
  //constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  //state
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
    .then((res) => {
      transition(SHOW);
    })
    .catch(() => {
      transition(ERROR_SAVE, true)
    })
  };

  //Delete appointment
  function remove() {
    transition(CONFIRM) 
  };
  function deleteAppointment() {
    transition(DELETING, true);
    props.deleteAppointment(props.id)
    .then((res) => {
      transition(EMPTY);
    })
    .catch(() => {
      transition(ERROR_DELETE, true)
    })
  }

  //Edit appointment
  function edit() {
    transition(EDIT)
  }

  //Transitions
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);
   

  return (
    <article className="appointment" data-testid="appointment">
    
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
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
      {mode === ERROR_SAVE && (
        <Err
          message="There was a problem saving the interview"
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Err
          message="There was a problem deleting the interview"
          onClose={back}
        />
      )}
      
    </article>
    
  )
}
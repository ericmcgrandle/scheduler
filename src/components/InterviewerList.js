import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";
const classNames = require('classnames');

const mapInterviewers = function (props) {
  const interviewers = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem 
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.interviewer}
      setInterviewer={(event) => props.setInterviewer(interviewer.id)}
      />
    );
  });
  return interviewers;
}


export default function InterviewList(props) {

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{mapInterviewers(props)}</ul>
    </section>
  );
}
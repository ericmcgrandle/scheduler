import React from "react";

import "components/InterviewerListItem.scss";
const classNames = require('classnames');


export default function InterviewerListItem(props) {
 
  const interviewClass = classNames({
    'interviewers__item': true,
    'interviewers__item--selected': props.selected,
    'interviewers__item--selected-image': (props.select && props.avatar)
  });

  return (
  <li className={interviewClass} onClick={props.setInterviewer}>
    <img
      className='interviewers__item-image'
      src={props.avatar}
      alt={props.name}
    />
    {props.selected && props.name}
  </li>
  );


}



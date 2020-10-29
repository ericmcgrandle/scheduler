import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, skip) {
    setMode(newMode);
    if (skip) {
      history.pop();
    }
    setHistory([...history, newMode]);
    
  }

  function back() {
    if (history.length === 1) {
      return;
    }
    history.pop();
    setMode(history[history.length-1]);
  }

  return { mode, transition, back };
};
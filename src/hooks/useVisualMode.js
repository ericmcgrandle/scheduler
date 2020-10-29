import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, skip) {
    setMode(newMode);
    if (skip) {
      const arr = [...history];
      arr.pop();
      setHistory(arr);
    }
    setHistory(prev => ([...prev, newMode]));
    
  }

  function back() {
    if (history.length === 1) {
      return;
    }
    const arr = [...history];
    arr.pop();
    setHistory(arr);

    setMode(arr[arr.length-1]);
  }

  return { mode, transition, back };
};
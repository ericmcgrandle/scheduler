import React, { useState } from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);

  console.log('mode', mode);

  return { mode };

};
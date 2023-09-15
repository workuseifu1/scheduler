import { useState } from "react";
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(newMode, replace = false) {
    if(replace) {
      setMode(newMode);
    } else {
      setHistory(prevHistory => [...prevHistory,newMode]);
      setMode(newMode)
    }
  }
  function back() {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setMode(newHistory[newHistory.length -1]);
    }    
  }
  return {
    mode,
    transition,
    back
  };
}
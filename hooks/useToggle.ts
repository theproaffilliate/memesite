// hooks/useToggle.ts
import { useCallback, useState } from "react";
export default function useToggle(initial = false) {
  const [val, setVal] = useState(initial);
  const on = useCallback(() => setVal(true), []);
  const off = useCallback(() => setVal(false), []);
  const toggle = useCallback(() => setVal(v => !v), []);
  return { val, on, off, toggle, set: setVal };
}

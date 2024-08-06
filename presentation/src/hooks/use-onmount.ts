import { useRef, useEffect } from "react";

export function useOnMount(callback: () => void, deps: any[] = []) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    callback();
  }, deps);
}

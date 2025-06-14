import { useEffect, useState } from "react";
import { debounce } from "lodash";

export default function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    const debouncedHandler = debounce(handler, 200); // Adjust delay as needed
    window.addEventListener("resize", debouncedHandler);
    return () => {
      window.removeEventListener("resize", debouncedHandler);
      debouncedHandler.cancel();
    };
  }, [breakpoint]);
  return isMobile;
}

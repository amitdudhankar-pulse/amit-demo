import React, {
  PropsWithChildren,
  ReactElement,
  useState,
  useEffect,
  RefObject,
  useRef,
  createRef,
} from "react";
import { ComparisonProvider } from "./comparison";
import { APIControls, APIProvider } from "./api";

const AppStateProvider = (props: PropsWithChildren) => (
  <>
    <APIProvider>
      <ComparisonProvider>{props.children}</ComparisonProvider>
    </APIProvider>
  </>
);

const StatefulBuilder = <T,>(props: {
  children?: (args: { state: T; setState: (value: T) => void }) => ReactElement;
  initialValue: T;
}) => {
  const [state, setState] = useState<T>(props.initialValue);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      setState(props.initialValue);
    }
  }, [props.initialValue, isClient]);
  
  return props.children?.({ state, setState });
};

export const useIntersectionObserver = (callback: () => void, options = {}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          callback();
        }
      },
      { ...options }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [callback, options]);

  return elementRef;
};

export { StatefulBuilder };
export { AppStateProvider };
export * from "./api";
export { AuthControls } from "./auth";
export { ComparisonControls } from "./comparison";

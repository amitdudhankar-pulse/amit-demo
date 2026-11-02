import { ReactNode, useEffect, useRef, useState } from "react";

const NavbarAnimation = (props: { children: ReactNode }) => {
  const [show, setShow] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const lastScrollYRef = useRef(0);

  const controlNavbar = () => {
    if (typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    setIsTop(currentScrollY === 0);
    setShow(currentScrollY > lastScrollYRef.current);
    lastScrollYRef.current = currentScrollY;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  return (
    <>
      {props.children}
      {!isTop && (
        <div
          className={`${
            show ? "animate-slide-up" : "animate-slide-down"
          }  z-50 fixed top-0 w-full outline outline-1 outline-gray-200`}
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export { NavbarAnimation };

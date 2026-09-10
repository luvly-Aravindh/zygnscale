import { useEffect, useState } from "react";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero");
      const consult = document.getElementById("consultation");
      const heroPast = hero ? hero.getBoundingClientRect().bottom < 0 : false;
      const consultRect = consult ? consult.getBoundingClientRect() : null;
      const consultVisible = consultRect
        ? consultRect.top < window.innerHeight && consultRect.bottom > 0
        : false;
      setVisible(heroPast && !consultVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={"sticky-bar" + (visible ? " visible" : "")} id="sticky-bar" inert={visible ? undefined : ""}>
      <div>
        <strong>Your firm. A clearer next step.</strong>
        <span>Free 30-minute consultation</span>
      </div>
      <a className="button" href="#consultation">
        CLAIM MY FREE CONSULTATION
        <svg aria-hidden="true" className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
      </a>
    </div>
  );
}

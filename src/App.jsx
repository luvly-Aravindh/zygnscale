import { useEffect } from "react";
import UrgencyBand from "./sections/UrgencyBand";
import Masthead from "./sections/Masthead";
import Hero from "./sections/Hero";
import FinallyLetter from "./sections/FinallyLetter";
import Blueprint from "./sections/Blueprint";
import Platform from "./sections/Platform";
import DiscoverAgenda from "./sections/DiscoverAgenda";
import ConfidencePromise from "./sections/ConfidencePromise";
import ConsultationForm from "./sections/ConsultationForm";
import Questions from "./sections/Questions";
import FinalClose from "./sections/FinalClose";
import SiteFooter from "./sections/SiteFooter";
import StickyBar from "./sections/StickyBar";

export default function App() {
  // Reading progress bar
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;
    let pending = false;
    const update = () => {
      pending = false;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.max(0, Math.min(100, (window.scrollY / total) * 100)) : 0;
      bar.style.width = pct + "%";
    };
    const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Footer year + motion toggle + urgency month
  useEffect(() => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    const monthEl = document.getElementById("urgency-month");
    if (monthEl) monthEl.textContent = new Date().toLocaleString("en-US", { month: "long" }).toUpperCase();

    const toggle = document.getElementById("motion-toggle");
    const onToggle = function () {
      const paused = document.body.classList.toggle("motion-paused");
      this.setAttribute("aria-pressed", String(paused));
      this.textContent = paused ? "Play animations" : "Pause animations";
    };
    if (toggle) toggle.addEventListener("click", onToggle);
    return () => { if (toggle) toggle.removeEventListener("click", onToggle); };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div aria-hidden="true" className="progress" id="reading-progress" />
      <UrgencyBand />
      <Masthead />
      <main id="main">
        <Hero />
        <FinallyLetter />
        <Blueprint />
        <Platform />
        <DiscoverAgenda />
        <ConfidencePromise />
        <ConsultationForm />
        <Questions />
        <FinalClose />
      </main>
      <SiteFooter />
      <StickyBar />
    </>
  );
}

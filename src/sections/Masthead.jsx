import zygnLogo from "../assets/logo.svg";

export default function Masthead() {
  return (
    <header className="masthead">
    <a aria-label="Zygn, back to top" className="brand-home" href="#top">
  <span aria-label="Zygn" className="wordmark">
    <img
      src={zygnLogo}
      alt="Zygn"
      className="w-25"
    />
  </span>
</a>
      <span className="brand-tagline">THE INTERIOR OPERATING SYSTEM</span>
    </header>
  );
}

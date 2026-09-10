import zygnLogo from "../assets/logo.svg";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="brand-home">
          <span aria-label="Zygn" className="wordmark">
  <img
    src={zygnLogo}
    alt="Zygn"
    className="brand-mark"
  />
</span>
          </div>
          <div className="footer-links">
            {/* <button aria-pressed="false" id="motion-toggle" type="button">
              Pause animations
            </button> */}
          </div>
        </div>
        <p className="footer-note">
          Product access, setup and commercial terms are subject to the agreed
          subscription. The money-back window is the first 30 days of the paid
          subscription. Workflow diagrams are illustrations, not product
          screenshots or customer results. The original product image links and
          video are hosted externally.
        </p>
        <div className="copyright">
          <span>
            © <span id="year">2026</span> Zygn. All rights reserved.
          </span>
          <span>The interior operating system.</span>
        </div>
      </div>
    </footer>
  );
}

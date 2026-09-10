export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="attention-wrap">
          <p className="kicker attention" id="attention">
            ATTENTION: INTERIOR DESIGN, DESIGN-BUILD &amp; MODULAR FACTORY
            OWNERS
          </p>
        </div>
        <h1 id="hero-heading">
          Give Us <span className="highlight">30 Minutes</span> &amp; We’ll Show
          You How To Take Back Control Of Your{" "}
          <span className="highlight">Projects, People &amp; Profit…</span>{" "}
          <span className="red">Without Chasing Your Team All Day.</span>
        </h1>
        <p className="hero-sub">
          Claim your <strong>FREE, no-obligation consultation</strong> to
          explore a connected way to manage your enquiries, projects, people,
          production and business insights.
          <br /> <strong>So you can run the business. Not chase it.</strong>
        </p>
        <figure
          aria-label="Original Zygn video"
          className="vsl-block"
          id="zygn-vsl"
        >
          <div className="vsl-intro">
            <span>
              <svg
                aria-hidden="true"
                className="icon"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="m9 5 11 7-11 7Z"></path>
              </svg>{" "}
              SEE ZYGN FOR YOURSELF
            </span>
          </div>
          <div className="vsl-frame" id="vsl-frame">
            <div className="vsl-offline" id="vsl-offline">
              <span className="vsl-small-wordmark">zygn</span>
              <strong>
                The business behind
                <br /> beautiful spaces.
              </strong>
              <button
                aria-label="Retry the inline Zygn video"
                className="vsl-offline-play"
                id="vsl-retry"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path d="m9 5 11 7-11 7Z"></path>
                </svg>
              </button>
              <span id="vsl-status">ORIGINAL ZYGN VIDEO</span>
            </div>
            <img
              alt="Original Zygn video thumbnail"
              className="vsl-thumbnail"
              decoding="async"
              fetchPriority="high"
              height="540"
              src="https://embed-ssl.wistia.com/deliveries/78fcad4abd46edcb76d6a524507c9c7091f51eac.jpg?image_play_button_size=2x&amp;image_crop_resized=960x540&amp;image_play_button_rounded=1&amp;image_play_button_color=2949E5e0"
              width="960"
            />
            <div id="vsl-player-mount"></div>
          </div>
          <figcaption>
            Original Zygn VSL <span>Autoplays muted</span>
          </figcaption>
        </figure>
        <div className="cta-group">
          <a className="button" href="#consultation">
            <span>CLAIM MY FREE CONSULTATION</span>
            <svg
              aria-hidden="true"
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path d="M4 12h16m-6-6 6 6-6 6"></path>
            </svg>
          </a>
          <p className="cta-note">
            <svg
              aria-hidden="true"
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"></path>
              <path d="m8 12 3 3 5-6"></path>
            </svg>{" "}
            30 minutes. No cost. No obligation to buy.
          </p>
        </div>
        <ul className="hero-proof">
          <li>
            <svg
              aria-hidden="true"
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path d="m5 12 4 4L19 6"></path>
            </svg>
            Project execution
          </li>
          <li>
            <svg
              aria-hidden="true"
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path d="m5 12 4 4L19 6"></path>
            </svg>
            Modular production
          </li>
          <li>
            <svg
              aria-hidden="true"
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path d="m5 12 4 4L19 6"></path>
            </svg>
            Zygn + ChatGPT
          </li>
        </ul>
        <div className="hero-flow">
          <ol aria-label="Connected project stages">
            <li style={{ "--node": "#3c796e" }}>
              <span className="flow-icon">
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 4h14v12H9l-4 4V4Z"></path>
                  <path d="M8 8h8M8 12h6"></path>
                </svg>
              </span>
              <b>ENQUIRY</b>
            </li>
            <li style={{ "--node": "#cb4928" }}>
              <span className="flow-icon">
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 3h8l4 4v14H6Z"></path>
                  <path d="M14 3v5h4M9 11h6M9 15h6M9 18h4"></path>
                </svg>
              </span>
              <b>BOQ</b>
            </li>
            <li style={{ "--node": "#edb128" }}>
              <span className="flow-icon">
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path d="m3 7 9-4 9 4v10l-9 4-9-4ZM3 7l9 5 9-5M12 12v9M8 5l9 5v5"></path>
                </svg>
              </span>
              <b>PURCHASE</b>
            </li>
            <li style={{ "--node": "#8f2f12" }}>
              <span className="flow-icon">
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 11 12 3l9 8M5 9v12h14V9M9 21v-7h6v7M10 9h4"></path>
                </svg>
              </span>
              <b>SITE WORK</b>
            </li>
            <li style={{ "--node": "#171915" }}>
              <span className="flow-icon">
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <rect height="15" rx="2" width="18" x="3" y="5"></rect>
                  <path d="M3 10h18M7 15h3M15 15h2"></path>
                </svg>
              </span>
              <b>BILLING</b>
            </li>
          </ol>
          <p>One project. Every stage connected.</p>
        </div>
      </div>
    </section>
  );
}

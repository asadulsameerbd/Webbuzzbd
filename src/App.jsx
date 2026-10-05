import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { PACKAGES, PORTFOLIO } from "./data/packages";

/* =========================================================
   API
========================================================= */

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/* =========================================================
   CONTACT
========================================================= */

const CONTACT = {
  payment: {
    bKash: "01933200699",
    Nagad: "01933200699",
    Rocket: "01933200699",
  },

  whatsapp: "https://wa.me/8801933200699",

  facebook: "https://www.facebook.com/profile.php?id=61576826618253",

  telegram: "https://t.me/asadulsameer",
};

/* =========================================================
   CUSTOM PACKAGE
========================================================= */

const CUSTOM_PACKAGE = {
  id: "custom-design",
  number: "06",
  name: "Custom Design",
  tagline: "A fully customized website based on your exact requirements.",
  price: null,
  icon: "✦",
  customPrice: true,

  features: [
    "Fully custom website",
    "Custom pages & sections",
    "Custom features & functionality",
    "Responsive design",
    "Business-focused development",
    "Requirement-based pricing",
    "Direct support",
  ],
};

/* =========================================================
   HELPERS
========================================================= */

const money = (n) => {
  if (n === null || n === undefined || n === "") {
    return "After Discussion";
  }

  const amount = Number(n);

  if (!Number.isFinite(amount)) {
    return "After Discussion";
  }

  return `৳${amount.toLocaleString("en-BD")}`;
};

const isCustomPackage = (pkg) =>
  pkg?.id === "custom-design" || pkg?.customPrice === true;

/* =========================================================
   APP
========================================================= */

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [portfolioFilter, setPortfolioFilter] = useState("All");

  /* =========================================================
     ALL PACKAGES
  ========================================================= */

  const allPackages = useMemo(() => {
    const safePackages = Array.isArray(PACKAGES) ? PACKAGES : [];

    const alreadyExists = safePackages.some(
      (pkg) => pkg.id === CUSTOM_PACKAGE.id,
    );

    return alreadyExists ? safePackages : [...safePackages, CUSTOM_PACKAGE];
  }, []);

  /* =========================================================
     PORTFOLIO FILTER
  ========================================================= */

  const filteredPortfolio = useMemo(() => {
    if (portfolioFilter === "All") {
      return PORTFOLIO;
    }

    const selectedFilter = portfolioFilter.trim().toLowerCase();

    return PORTFOLIO.filter(
      (item) => item.type?.trim().toLowerCase() === selectedFilter,
    );
  }, [portfolioFilter]);

  /* =========================================================
     CHOOSE PACKAGE
  ========================================================= */

  const choosePackage = (pkg) => {
    if (!pkg) return;

    setSelected(pkg);
    setCheckoutOpen(false);
    setCartOpen(true);
  };

  /* =========================================================
     START PROJECT
     
     IMPORTANT:
     If no package is selected, Custom Design will be selected
     automatically and checkout will open directly.
  ========================================================= */

  const startProject = () => {
    console.log("Start Project clicked");

    // Tablet + Desktop (768px and above) -> WhatsApp
    // Mobile (<768px) -> keep the existing checkout flow
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      window.location.href = CONTACT.whatsapp;
      return;
    }

    if (!selected) {
      setSelected(CUSTOM_PACKAGE);
      setCartOpen(false);
      setCheckoutOpen(true);
      return;
    }

    setCartOpen(false);
    setCheckoutOpen(true);
  };

  /* =========================================================
     RESET ORDER
  ========================================================= */

  const resetOrder = () => {
    setSubmittedOrder(null);
    setSelected(null);
    setCartOpen(false);
    setCheckoutOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (submittedOrder) {
    return <SuccessScreen order={submittedOrder} onHome={resetOrder} />;
  }

  return (
    <div className="site-shell">
      <Navbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        selected={selected}
        onStart={startProject}
        onCart={() => {
          if (selected) {
            setCartOpen(true);
          } else {
            startProject();
          }
        }}
      />

      <main>
        <Hero
          onExplore={() =>
            document.getElementById("packages")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        />

        <TrustBar />

        <Packages
          selected={selected}
          onChoose={choosePackage}
          packages={allPackages}
        />

        <Milestone />

        <PortfolioSection
          filter={portfolioFilter}
          setFilter={setPortfolioFilter}
          onChoose={choosePackage}
          items={filteredPortfolio}
          packages={allPackages}
        />

        <WhyUs />

        <Process />

        <FAQ />

        {/* IMPORTANT: FinalCTA is now a real component */}
        <FinalCTA onStart={startProject} />
      </main>

      <Footer />

      {cartOpen && selected && (
        <CartDrawer
          packageData={selected}
          onClose={() => setCartOpen(false)}
          onContinue={startProject}
        />
      )}

      {checkoutOpen && selected && (
        <CheckoutModal
          packageData={selected}
          apiUrl={API_URL}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={setSubmittedOrder}
        />
      )}
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ mobileOpen, setMobileOpen, selected, onStart, onCart }) {
  const links = [
    ["Services", "why"],
    ["Packages", "packages"],
    ["Portfolio", "portfolio"],
    ["FAQ", "faq"],
  ];

  return (
    <header className="navbar-wrap">
      <nav className="navbar container">
        <a className="brand" href="#top">
          <img src="/logo.png" alt="Webbuzz Digital Agency" />
        </a>

        <div className={`nav-links ${mobileOpen ? "show" : ""}`}>
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)}>
              {label}
            </a>
          ))}

          <button
            type="button"
            className="nav-cta"
            onClick={() => {
              setMobileOpen(false);
              onStart();
            }}
          >
            Start a Project <span>↗</span>
          </button>
        </div>

        <button type="button" className="cart-button" onClick={onCart}>
          <span>Project</span>
          <b>{selected ? "1" : "+"}</b>
        </button>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? "×" : "☰"}
        </button>
      </nav>
    </header>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero({ onExplore }) {
  return (
    <section className="hero" id="top">
      <div className="hero-glow glow-one" />
      <div className="hero-glow glow-two" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <i /> WEB DESIGN & DEVELOPMENT
          </div>

          <h1>
            Build a website
            <br />
            <em>that builds</em> your business.
          </h1>

          <p>
            Modern, responsive and business-focused websites for brands that
            want to look professional and get more customers.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={onExplore}>
              Explore Packages <span>↗</span>
            </button>

            <a
              className="text-btn"
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Talk to us <span>→</span>
            </a>
          </div>

          <div className="hero-note">
            <span>Starting from</span>
            <strong>৳2,000</strong>
            <small>• Pay now or discuss payment first</small>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit orbit-a" />
          <div className="visual-orbit orbit-b" />

          <div className="browser-card">
            <div className="browser-top">
              <div className="dots">
                <i />
                <i />
                <i />
              </div>

              <span>yourbusiness.com</span>

              <b>•••</b>
            </div>

            <div className="mock-page">
              <div className="mock-nav">
                <strong>
                  BRAND<span>.</span>
                </strong>

                <div>
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="mock-hero">
                <small>GROW ONLINE</small>

                <h3>
                  Make your brand
                  <br />
                  impossible to ignore.
                </h3>

                <button type="button">Get Started →</button>
              </div>

              <div className="mock-stats">
                <div>
                  <b>120+</b>
                  <span>Projects</span>
                </div>

                <div>
                  <b>98%</b>
                  <span>Satisfaction</span>
                </div>

                <div>
                  <b>24/7</b>
                  <span>Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="float-chip chip-one">✦ Responsive</div>

          <div className="float-chip chip-two">✓ Pay after discussion</div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TRUST BAR
========================================================= */

function TrustBar() {
  return (
    <section className="trust">
      <div className="container trust-inner">
        {[
          "Responsive Design",
          "Modern UI",
          "Flexible Payment",
          "Direct Support",
          "Fast Delivery",
        ].map((item) => (
          <div key={item}>
            <span>✓</span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PACKAGES
========================================================= */

function Packages({ selected, onChoose, packages }) {
  return (
    <section className="section packages-section" id="packages">
      <div className="container">
        <SectionHeading
          eyebrow="OUR PACKAGES"
          title={
            <>
              Choose what <em>you need.</em>
            </>
          }
          text="Pick a package, tell us what you need, then choose whether to pay now or discuss payment with our team."
        />

        <div className="package-grid">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              selected={selected?.id === pkg.id}
              onChoose={onChoose}
            />
          ))}
        </div>

        <div className="package-foot">
          <span>Not sure which package fits?</span>

          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
            Talk to us on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PACKAGE CARD
========================================================= */

function PackageCard({ pkg, selected, onChoose }) {
  const custom = isCustomPackage(pkg);

  return (
    <article className={`package-card ${selected ? "selected" : ""}`}>
      <div className="card-top">
        <span className="package-icon">{pkg.icon}</span>

        <span className="package-number">{pkg.number}</span>
      </div>

      <h3>{pkg.name}</h3>

      <p className="tagline">{pkg.tagline}</p>

      <div className="price-label">{custom ? "PRICING" : "STARTING FROM"}</div>

      <div className={`package-price ${custom ? "custom-price" : ""}`}>
        {custom ? "After Discussion" : money(pkg.price)}
      </div>

      <ul>
        {pkg.features?.map((feature) => (
          <li key={feature}>
            <span>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button type="button" className="card-btn" onClick={() => onChoose(pkg)}>
        {selected
          ? "Selected ✓"
          : custom
            ? "Discuss Your Project"
            : "Choose Package"}

        <span>↗</span>
      </button>
    </article>
  );
}

/* =========================================================
   MILESTONE
========================================================= */

function Milestone() {
  return (
    <section className="milestone-section" id="services">
      <div className="container milestone-grid">
        <div>
          <div className="eyebrow light">
            <i /> FLEXIBLE PAYMENT
          </div>

          <h2>
            Start now or
            <br />
            <em>discuss first.</em>
          </h2>

          <p>
            You can pay an initial milestone when placing the order, or simply
            choose <b>Pay Later / Discuss Payment</b>. We will review your
            requirements and confirm the payment schedule with you.
          </p>

          <a className="outline-light" href="#packages">
            Choose a package →
          </a>
        </div>

        <div className="milestone-card">
          <div className="milestone-head">
            <span>PAYMENT OPTIONS</span>
            <strong>Simple</strong>
          </div>

          <div className="payment-option active">
            <div>
              <small>OPTION</small>
              <b>20%</b>
            </div>

            <span>Start with a smaller milestone</span>

            <i>✓</i>
          </div>

          <div className="payment-option">
            <div>
              <small>OPTION</small>
              <b>30%</b>
            </div>

            <span>Pay more upfront if preferred</span>

            <i>✓</i>
          </div>

          <div className="payment-option">
            <div>
              <small>OPTION</small>
              <b>0%</b>
            </div>

            <span>Pay later after discussion</span>

            <i>✓</i>
          </div>

          <div className="milestone-note">
            No payment screenshot or transaction ID is required when you choose
            Pay Later.
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PORTFOLIO
========================================================= */

function PortfolioSection({ filter, setFilter, onChoose, items, packages }) {
  const filters = [
    "All",
    "Business",
    "E-commerce",
    "Healthcare",
    "Restaurant",
    "Portfolio",
  ];

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [filter]);

  const safeItems = Array.isArray(items) ? items : [];

  const visibleItems = showAll ? safeItems : safeItems.slice(0, 9);

  const hasMore = safeItems.length > 9;

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setShowAll(false);
  };

  const handleSimilar = (item) => {
    const itemType = item.type?.trim().toLowerCase();

    const matchedPackage = packages.find(
      (pkg) => pkg.name?.trim().toLowerCase() === itemType,
    );

    const fallbackCustom = packages.find((pkg) => pkg.id === "custom-design");

    onChoose(matchedPackage || fallbackCustom || packages[0]);
  };

  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="container">
        <SectionHeading
          eyebrow="SELECTED WORK"
          title={
            <>
              Built to look <em>credible.</em>
            </>
          }
          text="A few visual directions for the kind of websites we can build for your business."
        />

        <div className="filter-row">
          {filters.map((item) => {
            const isActive = filter === item;

            return (
              <button
                key={item}
                type="button"
                className={isActive ? "active" : ""}
                onClick={() => handleFilterChange(item)}
              >
                {item}
              </button>
            );
          })}
        </div>

        {visibleItems.length > 0 ? (
          <div className="portfolio-grid">
            {visibleItems.map((item) => (
              <article className="work-card" key={item.id}>
                <img src={item.image} alt={item.title} loading="lazy" />

                <div className="work-overlay">
                  <div>
                    <small>{item.type}</small>
                    <h3>{item.title}</h3>
                  </div>

                  <div className="work-actions">
                    {item.view && (
                      <a
                        href={item.view}
                        target="_blank"
                        rel="noreferrer"
                        className="view-btn"
                      >
                        View Website ↗
                      </a>
                    )}

                    <button type="button" onClick={() => handleSimilar(item)}>
                      Get Similar →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="portfolio-empty">
            <p>No projects available in this category yet.</p>
          </div>
        )}

        {hasMore && (
          <div className="portfolio-more">
            <button
              type="button"
              className="see-more-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less ↑" : "See More Projects ↓"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   WHY US
========================================================= */

function WhyUs() {
  const data = [
    [
      "01",
      "Modern Design",
      "Clean interfaces that make your business look established and trustworthy.",
    ],
    [
      "02",
      "Business Focused",
      "Layouts are built around your offer, audience and conversion goals.",
    ],
    [
      "03",
      "Flexible Payment",
      "Pay 20–30% to start, or choose Pay Later and discuss the payment schedule.",
    ],
    [
      "04",
      "Direct Support",
      "Clear communication from requirement collection to final delivery.",
    ],
  ];

  return (
    <section className="section why-section" id="why">
      <div className="container">
        <SectionHeading
          eyebrow="WHY WEBBUZZ"
          title={
            <>
              Simple process. <em>Serious results.</em>
            </>
          }
          text="No unnecessary complexity. Just a clear path from your idea to a working website."
        />

        <div className="why-grid">
          {data.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PROCESS
========================================================= */

function Process() {
  const items = [
    ["01", "Choose Package", "Pick the website type that fits your project."],
    [
      "02",
      "Tell Us What You Need",
      "Share your business details, references and requirements.",
    ],
    ["03", "Choose Payment", "Pay 20–30% now or choose Pay Later to discuss."],
    [
      "04",
      "Build & Launch",
      "We design, develop, review and deliver your website.",
    ],
  ];

  return (
    <section className="section process-section">
      <div className="container">
        <div className="process-wrap">
          <div className="process-intro">
            <div className="eyebrow">
              <i /> HOW IT WORKS
            </div>

            <h2>
              From idea to
              <br />
              <em>launch.</em>
            </h2>

            <p>Four simple steps. No confusing process.</p>
          </div>

          <div className="process-list">
            {items.map(([number, title, text]) => (
              <div className="process-item" key={number}>
                <span>{number}</span>

                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>

                <b>↗</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
========================================================= */

function FAQ() {
  const [open, setOpen] = useState(0);

  const faqs = [
    [
      "Do I have to pay the full amount upfront?",
      "No. You can pay 20% or 30% to start, or choose Pay Later / Discuss Payment and confirm the schedule with our team.",
    ],
    [
      "What happens if I choose Pay Later?",
      "Your order is submitted without any payment screenshot or transaction ID. We receive the project details on Telegram, review them and contact you to discuss the payment and project scope.",
    ],
    [
      "Can I customize a package?",
      "Yes. A package is a starting point. Extra pages, features or integrations can be added after reviewing your requirements.",
    ],
    [
      "Does the package include domain and hosting?",
      "It depends on the project. Domain, hosting, premium plugins and third-party services can be added separately when needed.",
    ],
    [
      "How long does a website take?",
      "Delivery time depends on the package, content readiness and feature scope. Your estimated timeline will be confirmed after requirement review.",
    ],
  ];

  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <em>answered.</em>
            </>
          }
          text="Everything you need to know before starting."
        />

        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <div
              className={`faq-item ${open === index ? "open" : ""}`}
              key={question}
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                <span>{question}</span>
                <b>{open === index ? "−" : "+"}</b>
              </button>

              {open === index && <p>{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCTA() {
  const whatsappUrl = "https://wa.me/8801933200699";

  return (
    <section className="final-cta">
      <div className="container">
        <div className="cta-glow" />

        <div className="eyebrow light">
          <i /> READY TO BUILD?
        </div>

        <h2>
          Let’s build something
          <br />
          <em>great together.</em>
        </h2>

        <p>Submit your project details. Pay now or discuss payment first.</p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            cursor: "pointer",
            position: "relative",
            zIndex: 10,
          }}
        >
          Start Your Project <span>↗</span>
        </a>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src="/logo.png" alt="Webbuzz" />

          <p>Modern websites for growing businesses.</p>
        </div>

        <div>
          <h4>Explore</h4>

          <a href="#packages">Packages</a>

          <a href="#portfolio">Portfolio</a>

          <a href="#faq">FAQ</a>
        </div>

        <div>
          <h4>Contact</h4>

          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>

          <a href={CONTACT.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>

          <a href={CONTACT.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
        </div>

        <div>
          <h4>Start</h4>

          <a href="#packages">Build a website</a>

          <a href="mailto:webbuzz0@gmail.com">webbuzz0@gmail.com</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Webbuzz BD. All rights reserved.</span>

        <span>Digital Agency</span>
      </div>
    </footer>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <div className="eyebrow">
        <i /> {eyebrow}
      </div>

      <h2>{title}</h2>

      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   CART DRAWER
========================================================= */

function CartDrawer({ packageData, onClose, onContinue }) {
  const custom = isCustomPackage(packageData);

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="cart-drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <small>YOUR PROJECT</small>
            <h2>Project bag</h2>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="selected-package">
          <span className="package-icon">{packageData.icon}</span>

          <div>
            <small>SELECTED PACKAGE</small>

            <h3>{packageData.name}</h3>

            <p>{packageData.tagline}</p>
          </div>

          <strong>
            {custom ? "After Discussion" : money(packageData.price)}
          </strong>
        </div>

        <div className="drawer-features">
          {packageData.features?.map((feature) => (
            <div key={feature}>
              <span>✓</span>
              {feature}
            </div>
          ))}
        </div>

        <div className="drawer-total">
          <div>
            <span>Project value</span>

            <b>{custom ? "After Discussion" : money(packageData.price)}</b>
          </div>

          {!custom && (
            <>
              <div>
                <span>20% start</span>

                <b>{money(Number(packageData.price) * 0.2)}</b>
              </div>

              <div>
                <span>30% start</span>

                <b>{money(Number(packageData.price) * 0.3)}</b>
              </div>
            </>
          )}

          <div>
            <span>Payment</span>

            <b>{custom ? "Discuss" : "Pay Later / Discuss"}</b>
          </div>
        </div>

        <div className="drawer-policy">
          {custom ? (
            <>
              Custom projects are priced after reviewing your requirements. Our
              team will contact you to discuss the scope and final price.
            </>
          ) : (
            <>
              No full payment is required upfront. At checkout you can pay 20%,
              30%, or choose <b>Pay Later / Discuss Payment</b>.
            </>
          )}
        </div>

        <button type="button" className="full-btn" onClick={onContinue}>
          Continue to order <span>↗</span>
        </button>
      </aside>
    </div>
  );
}

/* =========================================================
   CHECKOUT MODAL
========================================================= */

function CheckoutModal({ packageData, apiUrl, onClose, onSuccess }) {
  const custom = isCustomPackage(packageData);

  const [step, setStep] = useState(1);

  const [paymentOption, setPaymentOption] = useState("pay_later");

  const [loading, setLoading] = useState(false);

  const [screenshot, setScreenshot] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    businessName: "",
    website: "",
    reference: "",
    requirement: "",
    paymentMethod: "bKash",
    transactionId: "",
  });

  const paymentPercent = custom
    ? 0
    : paymentOption === "pay_20"
      ? 20
      : paymentOption === "pay_30"
        ? 30
        : 0;

  const numericPrice = Number(packageData.price);

  const safeNumericPrice = Number.isFinite(numericPrice) ? numericPrice : 0;

  const advance = custom
    ? 0
    : Math.round((safeNumericPrice * paymentPercent) / 100);

  const remaining = custom ? 0 : safeNumericPrice - advance;

  /* =========================================================
     UPDATE FORM
  ========================================================= */

  const update = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     NEXT STEP
  ========================================================= */

  const next = () => {
    if (
      step === 1 &&
      (!form.name.trim() || !form.phone.trim() || !form.email.trim())
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Required information missing",
        text: "Please fill your name, phone and email.",
      });
    }

    if (step === 2 && (!form.businessName.trim() || !form.requirement.trim())) {
      return Swal.fire({
        icon: "warning",
        title: "Tell us about the project",
        text: "Business name and project requirement are required.",
      });
    }

    setStep((prev) => prev + 1);
  };

  /* =========================================================
     PAYMENT OPTION
  ========================================================= */

  const choosePayment = (value) => {
    if (custom) {
      setPaymentOption("pay_later");
      return;
    }

    setPaymentOption(value);

    setForm((prev) => ({
      ...prev,

      paymentMethod:
        value === "pay_20" || value === "pay_30"
          ? prev.paymentMethod === "Pay Later"
            ? "bKash"
            : prev.paymentMethod
          : "Pay Later",

      transactionId: "",
    }));

    if (value === "pay_later") {
      setScreenshot(null);
    }
  };

  /* =========================================================
     SCREENSHOT
  ========================================================= */

  const handleScreenshot = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setScreenshot(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      e.target.value = "";

      return Swal.fire({
        icon: "warning",
        title: "Invalid file",
        text: "Please select an image file.",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      e.target.value = "";

      return Swal.fire({
        icon: "warning",
        title: "File too large",
        text: "Payment screenshot must be under 5MB.",
      });
    }

    setScreenshot(file);
  };

  /* =========================================================
     SUBMIT ORDER
  ========================================================= */

  const submit = async (e) => {
    e?.preventDefault();

    if (step !== 3) {
      return;
    }

    /* Custom projects do not require payment proof */

    if (
      !custom &&
      paymentOption !== "pay_later" &&
      !form.transactionId.trim() &&
      !screenshot
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Payment proof required",
        text: "Please provide either a Transaction ID or a payment screenshot.",
      });
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      fd.append("packageId", packageData.id);

      fd.append("packageName", packageData.name);

      fd.append("paymentOption", custom ? "pay_later" : paymentOption);

      fd.append(
        "totalAmount",
        custom ? "After Discussion" : String(packageData.price),
      );

      fd.append("milestonePercent", String(paymentPercent));

      fd.append("advanceAmount", String(advance));

      fd.append("remainingAmount", custom ? "To Be Agreed" : String(remaining));

      fd.append("customPrice", String(custom));

      if (screenshot && !custom) {
        fd.append("screenshot", screenshot);
      }

      /* Prevent //api/orders */

      const cleanApiUrl = String(apiUrl || "").replace(/\/+$/, "");

      if (!cleanApiUrl) {
        throw new Error("API URL is not configured.");
      }

      const endpoint = `${cleanApiUrl}/api/orders`;

      console.log("Submitting order to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        body: fd,
      });

      const contentType = response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const responseText = await response.text();

        throw new Error(responseText || "Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Order submission failed.");
      }

      onSuccess(data?.order || data);
    } catch (error) {
      console.error("ORDER SUBMISSION ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Could not submit order",
        text: error?.message || "Please check your server URL and deployment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="checkout-modal">
        <div className="checkout-head">
          <div>
            <small>WEBBUZZ PROJECT ORDER</small>

            <h2>Start your project</h2>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="steps">
          <span className={step >= 1 ? "active" : ""}>
            01 <b>Info</b>
          </span>

          <i />

          <span className={step >= 2 ? "active" : ""}>
            02 <b>Project</b>
          </span>

          <i />

          <span className={step >= 3 ? "active" : ""}>
            03 <b>Payment</b>
          </span>
        </div>

        <div className="checkout-body">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (
              <div className="form-step">
                <FormTitle
                  title="Your information"
                  text="Tell us how we can reach you."
                />

                <div className="form-grid">
                  <Field
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your name"
                  />

                  <Field
                    label="Phone *"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="01XXXXXXXXX"
                  />

                  <Field
                    label="Email *"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                  />

                  <Field
                    label="WhatsApp"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={update}
                    placeholder="WhatsApp number"
                  />
                </div>
              </div>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (
              <div className="form-step">
                <FormTitle
                  title="Project details"
                  text={
                    custom
                      ? "You selected Custom Design — pricing will be confirmed after discussion."
                      : `You selected ${packageData.name} — ${money(
                          packageData.price,
                        )}.`
                  }
                />

                <div className="form-grid">
                  <Field
                    label="Business / Brand Name *"
                    name="businessName"
                    value={form.businessName}
                    onChange={update}
                    placeholder="Your business name"
                  />

                  <Field
                    label="Website Type"
                    name="website"
                    value={form.website}
                    onChange={update}
                    placeholder="e.g. service, store, personal"
                  />

                  <Field
                    label="Reference Website / Facebook Page"
                    name="reference"
                    value={form.reference}
                    onChange={update}
                    placeholder="https://..."
                    full
                  />

                  <Field
                    label="What do you need? *"
                    name="requirement"
                    value={form.requirement}
                    onChange={update}
                    placeholder="Tell us about your website, pages, features, style..."
                    textarea
                    full
                  />
                </div>
              </div>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {step === 3 && (
              <div className="form-step">
                <FormTitle
                  title="Choose your payment"
                  text={
                    custom
                      ? "Custom Design projects are priced after reviewing your requirements."
                      : "You can pay now or submit the order first and discuss payment with us."
                  }
                />

                {/* CUSTOM PAYMENT */}

                {custom ? (
                  <div className="pay-later-note custom-payment-note">
                    <span>✦</span>

                    <div>
                      <b>Custom Project — Price After Discussion</b>

                      <p>
                        This project is fully customized based on your
                        requirements. No payment is required now. Submit your
                        project details and our team will contact you to discuss
                        the scope, features and final price.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* NORMAL PAYMENT OPTIONS */

                  <div className="payment-choice-grid three">
                    <button
                      type="button"
                      className={paymentOption === "pay_20" ? "chosen" : ""}
                      onClick={() => choosePayment("pay_20")}
                    >
                      <small>START WITH</small>

                      <strong>20%</strong>

                      <span>{money(Number(packageData.price) * 0.2)}</span>

                      <b>
                        {paymentOption === "pay_20" ? "✓ Selected" : "Pay 20%"}
                      </b>
                    </button>

                    <button
                      type="button"
                      className={paymentOption === "pay_30" ? "chosen" : ""}
                      onClick={() => choosePayment("pay_30")}
                    >
                      <small>START WITH</small>

                      <strong>30%</strong>

                      <span>{money(Number(packageData.price) * 0.3)}</span>

                      <b>
                        {paymentOption === "pay_30" ? "✓ Selected" : "Pay 30%"}
                      </b>
                    </button>

                    <button
                      type="button"
                      className={`pay-later-choice ${
                        paymentOption === "pay_later" ? "chosen" : ""
                      }`}
                      onClick={() => choosePayment("pay_later")}
                    >
                      <small>NO PAYMENT NOW</small>

                      <strong>Pay Later</strong>

                      <span>Discuss with us</span>

                      <b>
                        {paymentOption === "pay_later"
                          ? "✓ Selected"
                          : "Choose"}
                      </b>
                    </button>
                  </div>
                )}

                {/* PAYMENT SUMMARY */}

                <div className="payment-summary">
                  <div>
                    <span>Package</span>
                    <b>{packageData.name}</b>
                  </div>

                  <div>
                    <span>Total project value</span>

                    <b>
                      {custom ? "After Discussion" : money(packageData.price)}
                    </b>
                  </div>

                  <div>
                    <span>Pay now</span>

                    <b>
                      {custom
                        ? "No payment now"
                        : paymentOption === "pay_later"
                          ? "After discussion"
                          : money(advance)}
                    </b>
                  </div>

                  <div>
                    <span>Remaining</span>

                    <b>
                      {custom
                        ? "To be agreed"
                        : paymentOption === "pay_later"
                          ? "To be agreed"
                          : money(remaining)}
                    </b>
                  </div>
                </div>

                {/* PAYMENT PROOF */}

                {!custom && paymentOption !== "pay_later" && (
                  <div className="form-grid payment-proof">
                    <label className="field">
                      <span>Payment Method *</span>

                      <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={update}
                      >
                        <option>bKash</option>

                        <option>Nagad</option>

                        <option>Rocket</option>
                      </select>
                    </label>

                    <Field
                      label="Transaction ID"
                      name="transactionId"
                      value={form.transactionId}
                      onChange={update}
                      placeholder="Enter transaction ID"
                    />

                    <label className="upload-box">
                      <span>Payment Screenshot</span>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleScreenshot}
                      />

                      <strong>
                        {screenshot ? screenshot.name : "Choose screenshot"}
                      </strong>

                      <small>Optional • PNG/JPG/WebP • Max 5MB</small>
                    </label>

                    <div className="payment-proof-note">
                      <small>
                        <b>Payment proof:</b> Transaction ID or screenshot. Any
                        one is enough.
                      </small>
                    </div>

                    <div className="payment-number">
                      <span>
                        Send {money(advance)} via {form.paymentMethod}
                      </span>

                      <b>{CONTACT.payment[form.paymentMethod]}</b>

                      <small>{form.paymentMethod} Personal Number</small>
                    </div>
                  </div>
                )}

                {/* PAY LATER */}

                {(custom || paymentOption === "pay_later") && (
                  <div className="pay-later-note">
                    <span>✓</span>

                    <div>
                      <b>No payment required now</b>

                      <p>
                        {custom
                          ? "Your custom project details will be sent directly to our team. We will review your requirements and contact you to discuss the final price and payment schedule."
                          : "Your order details will be sent directly to our Telegram. We will review your requirements and contact you to discuss the payment schedule."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                CHECKOUT ACTIONS
            ================================================= */}

            <div className="checkout-actions">
              {step > 1 ? (
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button type="button" className="full-btn small" onClick={next}>
                  Continue <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="full-btn small"
                  onClick={submit}
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : custom || paymentOption === "pay_later"
                      ? "Submit & Discuss Payment"
                      : "Place Project Order"}

                  {!loading && <span>↗</span>}
                </button>
              )}
            </div>
          </form>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">
            <small>YOUR ORDER</small>

            <h3>{packageData.name}</h3>

            <p>{packageData.tagline}</p>

            <div className="summary-price">
              {custom ? "After Discussion" : money(packageData.price)}
            </div>

            <div className="summary-rule" />

            {packageData.features?.slice(0, 5).map((feature) => (
              <div className="summary-feature" key={feature}>
                <span>✓</span>
                {feature}
              </div>
            ))}

            <div className="summary-milestone">
              <span>Payment</span>

              <strong>
                {custom
                  ? "Discuss first"
                  : paymentOption === "pay_later"
                    ? "Discuss first"
                    : `${paymentPercent}% to start`}
              </strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FORM TITLE
========================================================= */

function FormTitle({ title, text }) {
  return (
    <div className="form-title">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
  full = false,
}) {
  return (
    <label className={`field ${full ? "full" : ""}`}>
      <span>{label}</span>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows="5"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

/* =========================================================
   SUCCESS SCREEN
========================================================= */

function SuccessScreen({ order, onHome }) {
  const custom =
    order?.customPrice === true ||
    order?.customPrice === "true" ||
    order?.packageId === "custom-design" ||
    order?.totalAmount === "After Discussion";

  return (
    <div className="success-page">
      <div className="success-glow" />

      <div className="success-card">
        <div className="success-icon">✓</div>

        <div className="eyebrow">
          <i /> ORDER RECEIVED
        </div>

        <h1>
          Project request
          <br />
          <em>received.</em>
        </h1>

        <p>
          Thanks! Your project request has been sent to our team. We will review
          it and contact you shortly.
        </p>

        <div className="order-id">
          <small>ORDER ID</small>

          <strong>{order?.orderId || "Pending"}</strong>
        </div>

        <div className="success-details">
          <div>
            <span>Package</span>

            <b>{order?.packageName || "Custom Design"}</b>
          </div>

          <div>
            <span>Project value</span>

            <b>{custom ? "After Discussion" : money(order?.totalAmount)}</b>
          </div>

          <div>
            <span>Payment</span>

            <b>
              {custom || order?.paymentOption === "pay_later"
                ? "Pay Later / Discuss"
                : `${money(order?.advanceAmount)} (${
                    order?.milestonePercent
                  }%)`}
            </b>
          </div>

          <div>
            <span>Status</span>

            <b>New</b>
          </div>
        </div>

        {order?.paymentScreenshotUrl && (
          <div className="success-proof">
            <span>Payment Screenshot</span>

            <a
              href={order.paymentScreenshotUrl}
              target="_blank"
              rel="noreferrer"
            >
              View Screenshot ↗
            </a>
          </div>
        )}

        <div className="success-actions">
          <a
            className="outline-btn"
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>

          <button type="button" className="primary-btn" onClick={onHome}>
            Back to home ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

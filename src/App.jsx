import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { PACKAGES, PORTFOLIO } from "./data/packages";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [portfolioFilter, setPortfolioFilter] = useState("All");

  const filteredPortfolio = useMemo(
    () =>
      portfolioFilter === "All"
        ? PORTFOLIO
        : PORTFOLIO.filter((x) => x.type === portfolioFilter),
    [portfolioFilter],
  );

  const choosePackage = (pkg) => {
    setSelected(pkg);
    setCartOpen(true);
  };

  const startProject = () => {
    if (!selected) {
      document
        .getElementById("packages")
        ?.scrollIntoView({ behavior: "smooth" });

      return;
    }

    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const resetOrder = () => {
    setSubmittedOrder(null);
    setSelected(null);
    setCheckoutOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submittedOrder) {
    return <SuccessScreen order={submittedOrder} onHome={resetOrder} />;
  }

  return (
    <div className="site-shell">
      <Navbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        selected={selected}
        onCart={() =>
          selected
            ? setCartOpen(true)
            : document.getElementById("packages")?.scrollIntoView({
                behavior: "smooth",
              })
        }
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

        <Packages selected={selected} onChoose={choosePackage} />

        <Milestone />

        <PortfolioSection
          filter={portfolioFilter}
          setFilter={setPortfolioFilter}
          onChoose={choosePackage}
          items={filteredPortfolio}
        />

        <WhyUs />

        <Process />

        <FAQ />

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

function Navbar({ mobileOpen, setMobileOpen, selected, onCart }) {
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
            className="nav-cta"
            onClick={() => {
              setMobileOpen(false);

              document.getElementById("packages")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Start a Project <span>↗</span>
          </button>
        </div>

        <button className="cart-button" onClick={onCart}>
          <span>Project</span>
          <b>{selected ? "1" : "+"}</b>
        </button>

        <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
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
            <button className="primary-btn" onClick={onExplore}>
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

                <button>Get Started →</button>
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

function Packages({ selected, onChoose }) {
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
          {PACKAGES.map((pkg) => (
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

function PackageCard({ pkg, selected, onChoose }) {
  return (
    <article className={`package-card ${selected ? "selected" : ""}`}>
      <div className="card-top">
        <span className="package-icon">{pkg.icon}</span>

        <span className="package-number">{pkg.number}</span>
      </div>

      <h3>{pkg.name}</h3>

      <p className="tagline">{pkg.tagline}</p>

      <div className="price-label">Starting from</div>

      <div className="package-price">{money(pkg.price)}</div>

      <ul>
        {pkg.features.map((feature) => (
          <li key={feature}>
            <span>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button className="card-btn" onClick={() => onChoose(pkg)}>
        {selected ? "Selected ✓" : "Choose Package"} <span>↗</span>
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

function PortfolioSection({ filter, setFilter, onChoose, items }) {
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

  const visibleItems = showAll ? items : items.slice(0, 9);

  const hasMore = items.length > 9;

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
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {visibleItems.map((item) => (
            <article className="work-card" key={item.id}>
              <img src={item.image} alt={item.title} />

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

                  <button
                    onClick={() =>
                      onChoose(
                        PACKAGES.find(
                          (pkg) =>
                            pkg.name.toLowerCase() === item.type.toLowerCase(),
                        ) || PACKAGES[0],
                      )
                    }
                  >
                    Get Similar →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="portfolio-more">
            <button
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
              <button onClick={() => setOpen(open === index ? -1 : index)}>
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

function FinalCTA({ onStart }) {
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

        <button className="primary-btn" onClick={onStart}>
          Start Your Project <span>↗</span>
        </button>
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
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="cart-drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <small>YOUR PROJECT</small>
            <h2>Project bag</h2>
          </div>

          <button onClick={onClose}>×</button>
        </div>

        <div className="selected-package">
          <span className="package-icon">{packageData.icon}</span>

          <div>
            <small>SELECTED PACKAGE</small>

            <h3>{packageData.name}</h3>

            <p>{packageData.tagline}</p>
          </div>

          <strong>{money(packageData.price)}</strong>
        </div>

        <div className="drawer-features">
          {packageData.features.map((feature) => (
            <div key={feature}>
              <span>✓</span>
              {feature}
            </div>
          ))}
        </div>

        <div className="drawer-total">
          <div>
            <span>Project value</span>
            <b>{money(packageData.price)}</b>
          </div>

          <div>
            <span>20% start</span>
            <b>{money(packageData.price * 0.2)}</b>
          </div>

          <div>
            <span>30% start</span>
            <b>{money(packageData.price * 0.3)}</b>
          </div>

          <div>
            <span>Pay Later</span>
            <b>Discuss</b>
          </div>
        </div>

        <div className="drawer-policy">
          No full payment is required upfront. At checkout you can pay 20%, 30%,
          or choose <b>Pay Later / Discuss Payment</b>.
        </div>

        <button className="full-btn" onClick={onContinue}>
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

  const paymentPercent =
    paymentOption === "pay_20" ? 20 : paymentOption === "pay_30" ? 30 : 0;

  const advance = Math.round((packageData.price * paymentPercent) / 100);

  const remaining = packageData.price - advance;

  const update = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const next = () => {
    if (step === 1 && (!form.name || !form.phone || !form.email)) {
      return Swal.fire({
        icon: "warning",
        title: "Required information missing",
        text: "Please fill your name, phone and email.",
      });
    }

    if (step === 2 && (!form.businessName || !form.requirement)) {
      return Swal.fire({
        icon: "warning",
        title: "Tell us about the project",
        text: "Business name and project requirement are required.",
      });
    }

    setStep((prev) => prev + 1);
  };

  const choosePayment = (value) => {
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

  const submit = async (e) => {
    e?.preventDefault();

    if (step !== 3) {
      return;
    }

    if (
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

      fd.append("paymentOption", paymentOption);

      fd.append("totalAmount", String(packageData.price));

      fd.append("milestonePercent", String(paymentPercent));

      fd.append("advanceAmount", String(advance));

      fd.append("remainingAmount", String(remaining));

      if (screenshot) {
        fd.append("screenshot", screenshot);
      }

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        body: fd,
      });

      const contentType = response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(text || "Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Order submission failed.");
      }

      onSuccess(data.order);
    } catch (error) {
      console.error("ORDER SUBMISSION ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Could not submit order",
        text: error.message || "Please check your server URL and deployment.",
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

          <button onClick={onClose}>×</button>
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
            {/* STEP 1 */}

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

            {/* STEP 2 */}

            {step === 2 && (
              <div className="form-step">
                <FormTitle
                  title="Project details"
                  text={`You selected ${packageData.name} — ${money(
                    packageData.price,
                  )}.`}
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

            {/* STEP 3 */}

            {step === 3 && (
              <div className="form-step">
                <FormTitle
                  title="Choose your payment"
                  text="You can pay now or submit the order first and discuss payment with us."
                />

                <div className="payment-choice-grid three">
                  <button
                    type="button"
                    className={paymentOption === "pay_20" ? "chosen" : ""}
                    onClick={() => choosePayment("pay_20")}
                  >
                    <small>START WITH</small>

                    <strong>20%</strong>

                    <span>{money(packageData.price * 0.2)}</span>

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

                    <span>{money(packageData.price * 0.3)}</span>

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
                      {paymentOption === "pay_later" ? "✓ Selected" : "Choose"}
                    </b>
                  </button>
                </div>

                <div className="payment-summary">
                  <div>
                    <span>Package</span>
                    <b>{packageData.name}</b>
                  </div>

                  <div>
                    <span>Total project value</span>

                    <b>{money(packageData.price)}</b>
                  </div>

                  <div>
                    <span>Pay now</span>

                    <b>
                      {paymentOption === "pay_later"
                        ? "After discussion"
                        : money(advance)}
                    </b>
                  </div>

                  <div>
                    <span>Remaining</span>

                    <b>
                      {paymentOption === "pay_later"
                        ? "To be agreed"
                        : money(remaining)}
                    </b>
                  </div>
                </div>

                {/* PAYMENT PROOF */}

                {paymentOption !== "pay_later" && (
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

                {paymentOption === "pay_later" && (
                  <div className="pay-later-note">
                    <span>✓</span>

                    <div>
                      <b>No payment required now</b>

                      <p>
                        Your order details will be sent directly to our
                        Telegram. We will review your requirements and contact
                        you to discuss the payment schedule.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACTIONS */}

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
                    : paymentOption === "pay_later"
                      ? "Submit & Discuss Payment"
                      : "Place Project Order"}

                  {!loading && <span>↗</span>}
                </button>
              )}
            </div>
          </form>

          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">
            <small>YOUR ORDER</small>

            <h3>{packageData.name}</h3>

            <p>{packageData.tagline}</p>

            <div className="summary-price">{money(packageData.price)}</div>

            <div className="summary-rule" />

            {packageData.features.slice(0, 5).map((feature) => (
              <div className="summary-feature" key={feature}>
                <span>✓</span>
                {feature}
              </div>
            ))}

            <div className="summary-milestone">
              <span>Payment</span>

              <strong>
                {paymentOption === "pay_later"
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

          <strong>{order.orderId}</strong>
        </div>

        <div className="success-details">
          <div>
            <span>Package</span>

            <b>{order.packageName}</b>
          </div>

          <div>
            <span>Project value</span>

            <b>{money(order.totalAmount)}</b>
          </div>

          <div>
            <span>Payment</span>

            <b>
              {order.paymentOption === "pay_later"
                ? "Pay Later / Discuss"
                : `${money(order.advanceAmount)} (${order.milestonePercent}%)`}
            </b>
          </div>

          <div>
            <span>Status</span>

            <b>New</b>
          </div>
        </div>

        {order.paymentScreenshotUrl && (
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

          <button className="primary-btn" onClick={onHome}>
            Back to home ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

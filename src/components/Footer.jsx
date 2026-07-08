import React, { useState } from "react";
import { useTenant } from "../context/TenantContext";

const Footer = () => {
  const tenant = useTenant();
  const footer = tenant.footer;
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[var(--color-surface)] pt-16 pb-8 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="mb-16 md:mb-20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="bungee-regular text-2xl md:text-3xl text-text-main uppercase tracking-tight mb-3">
              Stay in the Loop
            </h3>
            <p className="text-text-muted text-sm md:text-base mb-6">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-page-bg)] text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-button-primary-hover)] transition-all duration-300 tracking-wider uppercase text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  className="w-6 h-6"
                >
                  <circle cx="20" cy="20" r="16" stroke="#fff" strokeWidth="2" />
                  <path
                    d="M12 20c4-8 12-8 16 0"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 20c4 8 12 8 16 0"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-lg text-text-main">{tenant.name}</h4>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              {footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-text-main mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {footer.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-text-muted text-sm hover:text-accent transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-text-main mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-3">
              {footer.phone && (
                <li className="flex items-start gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-accent shrink-0 mt-0.5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:${footer.phone}`} className="text-text-muted text-sm hover:text-accent transition-colors">
                    {footer.phone}
                  </a>
                </li>
              )}
              {footer.email && (
                <li className="flex items-start gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-accent shrink-0 mt-0.5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href={`mailto:${footer.email}`} className="text-text-muted text-sm hover:text-accent transition-colors">
                    {footer.email}
                  </a>
                </li>
              )}
              {footer.address && (
                <li className="flex items-start gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-accent shrink-0 mt-0.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-text-muted text-sm">{footer.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-text-main mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href={footer.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="#fff"
                  className="w-5 h-5"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href={footer.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="#fff"
                  className="w-5 h-5"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-border)] mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[13px] text-text-muted">
            © {new Date().getFullYear()} {tenant.name}. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-text-muted">Powered by</span>
            <span
              className="font-black text-[16px] text-text-main tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {footer.poweredBy}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

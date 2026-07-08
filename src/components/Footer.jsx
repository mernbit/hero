import React from "react";
import { useTenant } from "../context/TenantContext";

const Footer = () => {
  const tenant = useTenant();
  const footer = tenant.footer;

  // Split links into Support and Info columns
  const supportLinks = (footer.links || []).slice(0, 4);
  const infoLinks = (footer.links || []).slice(4, 8);

  return (
    <footer className="w-full pt-20 pb-12" style={{ backgroundColor: "var(--color-accent)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          {/* Column 1 - Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                <path d="M7 2v20"></path>
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
              </svg>
              <h2 className="bungee-regular font-bold text-3xl text-white">
                {tenant.name}
              </h2>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              {footer.description}
            </p>
          </div>

          {/* Column 2 - Support */}
          <div>
            <h3 className="font-bold text-white mb-5 text-base" style={{ fontFamily: "'Poppins', 'Quicksand', sans-serif" }}>
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white/80 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Info */}
          <div>
            <h3 className="font-bold text-white mb-5 text-base" style={{ fontFamily: "'Poppins', 'Quicksand', sans-serif" }}>
              Info
            </h3>
            <ul className="space-y-4">
              {infoLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white/80 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-bold text-white mb-5 text-base" style={{ fontFamily: "'Poppins', 'Quicksand', sans-serif" }}>
              Contact
            </h3>
            <div className="space-y-4">
              {footer.address && (
                <p className="text-white/80 text-sm leading-relaxed">
                  {footer.address}
                </p>
              )}
              {footer.email && (
                <p className="text-white/80 text-sm">
                  {footer.email}
                </p>
              )}
              {footer.phone && (
                <p className="text-white/80 text-sm">
                  {footer.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white/80 text-sm">
            {new Date().getFullYear()} {tenant.name}. All rights reserved
          </span>
          {footer.poweredBy && (
            <span className="text-white/80 text-sm">
              Powered by <span className="font-semibold text-white">{footer.poweredBy}</span>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
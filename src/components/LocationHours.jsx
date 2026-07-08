import React from "react";
import { useTenant } from "../context/TenantContext";

const LocationHours = () => {
  const tenant = useTenant();
  const location = tenant.location || {};

  if (!location || !location.enabled) {
    return null;
  }

  const {
    headline = "Location & Hours",
    address = "",
    phone = "",
    email = "",
    hours = [],
    mapEmbed = ""
  } = location;

  return (
    <div className="w-full bg-[#f2f4f7] relative py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 
            className="bungee-regular text-3xl md:text-4xl text-text-main uppercase tracking-tight mb-4"
          >
            {headline}
          </h2>
          <div className="w-[60px] h-[4px] bg-accent mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Contact Info & Hours */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg h-full">
              {/* Address */}
              {address && (
                <div className="mb-8">
                  <h3 className="font-bold text-xl text-text-main mb-4 flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-accent">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Address
                  </h3>
                  <p className="text-base text-text-muted leading-relaxed pl-9">
                    {address}
                  </p>
                </div>
              )}

              {/* Contact */}
              <div className="mb-8">
                <h3 className="font-bold text-xl text-text-main mb-4 flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-accent">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Contact
                </h3>
                <div className="space-y-3 pl-9">
                  {phone && (
                    <a href={`tel:${phone}`} className="block text-base text-text-muted hover:text-accent transition-colors">
                      {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="block text-base text-text-muted hover:text-accent transition-colors">
                      {email}
                    </a>
                  )}
                </div>
              </div>

              {/* Hours */}
              {hours && hours.length > 0 && (
                <div>
                  <h3 className="font-bold text-xl text-text-main mb-4 flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-accent">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Hours
                  </h3>
                  <div className="space-y-2 pl-9">
                    {hours.map((item, index) => (
                      <div key={index} className="flex justify-between text-base">
                        <span className="text-text-muted">{item.day}</span>
                        <span className="text-text-main font-medium">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Map */}
          {mapEmbed && (
            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px]">
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: mapEmbed }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationHours;

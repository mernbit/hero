import React from "react";
import { useTenant } from "../context/TenantContext";

const AboutUs = () => {
  const tenant = useTenant();
  const about = tenant.about || {};

  if (!about || !about.enabled) {
    return null;
  }

  const {
    headline = "About Us",
    description = "",
    story = "",
    image,
    stats = []
  } = about;

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
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Image */}
          {image && (
            <div className="flex-1 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={image}
                  alt="About us"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {/* Right: Content */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              {/* Description */}
              {description && (
                <p className="text-lg text-text-main leading-relaxed mb-8">
                  {description}
                </p>
              )}

              {/* Story */}
              {story && (
                <div className="mb-8">
                  <h3 className="font-bold text-xl text-text-main mb-4">Our Story</h3>
                  <p className="text-base text-text-muted leading-relaxed">
                    {story}
                  </p>
                </div>
              )}

              {/* Stats */}
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="font-black text-3xl md:text-4xl text-accent mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-text-muted uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

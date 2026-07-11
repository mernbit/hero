import React from "react";
import { useParams } from "react-router-dom";
import { TenantProvider, useTenant } from "../../context/TenantContext";
import { CartProvider } from "../../context/CartContext";
import Hero from "../../components/Hero";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import ExploreMenu from "../../components/ExploreMenu";
import TopDeals from "../../components/TopDeals";
import Gallery from "../../components/Gallery";
import BookATable from "../../components/BookATable";
import Testimonials from "../../components/Testimonials";
import AboutUs from "../../components/AboutUs";
import LocationHours from "../../components/LocationHours";
import AnimatedRoadmap from "../../components/AnimatedRoadmap";

const Restaurant = () => {
  // Extract the slug from the URL e.g. /the-creamery or /abc-restaurant
  const { slug } = useParams();

  return (
    <TenantProvider slug={slug}>
      <CartProvider>
        <div className="w-full">
          <Hero />
          <ExploreMenu />
          <Menu />
          <AnimatedRoadmap />
          <Gallery />
          <TopDeals />
          <Testimonials />
          <AboutUs />
          <LocationHours />
          <BookATable />
          <Footer />
        </div>
      </CartProvider>
    </TenantProvider>
  );
};

export default Restaurant;

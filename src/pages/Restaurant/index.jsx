import React from "react";
import { useParams } from "react-router-dom";
import { TenantProvider, useTenant } from "../../context/TenantContext";
import { CartProvider } from "../../context/CartContext";
import Hero from "../Hero";
import Menu from "../Menu";
import Footer from "../../components/Footer";
import ExploreMenu from "../../components/ExploreMenu";
import TopDeals from "../../components/TopDeals";
import Gallery from "../../components/Gallery";

const Restaurant = () => {
  // Extract the slug from the URL e.g. /the-creamery or /abc-resturant
  const { slug } = useParams();

  return (
    <TenantProvider slug={slug}>
      <CartProvider>
        <div className="w-full">
          <Hero />
          <ExploreMenu />
          <Menu />
          <Gallery />
          <TopDeals />
          <Footer />
        </div>
      </CartProvider>
    </TenantProvider>
  );
};

export default Restaurant;

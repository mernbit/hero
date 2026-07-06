import React from "react";
import { useParams } from "react-router-dom";
import { TenantProvider } from "../../context/TenantContext";
import Hero from "../Hero";
import Menu from "../Menu";
import Footer from "../../components/Footer";
import ExploreMenu from "../../components/ExploreMenu";

const Restaurant = () => {
  // Extract the slug from the URL e.g. /the-creamery or /abc-resturant
  const { slug } = useParams();

  return (
    <TenantProvider slug={slug}>
      <div className="w-full">
        <Hero />
        <ExploreMenu />
        <Menu />
        <Footer />
      </div>
    </TenantProvider>
  );
};

export default Restaurant;

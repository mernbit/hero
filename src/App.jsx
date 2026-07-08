import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Restaurant from "./pages/Restaurant";
import ExploreMenuPage from "./pages/ExploreMenuPage";
import CartPage from "./pages/CartPage";
import { TenantProvider } from "./context/TenantContext";
import { CartProvider } from "./context/CartContext";
import About from "./pages/About";

// Wrapper to provide TenantContext for standalone pages
const TenantPageWrapper = ({ children }) => {
  const { slug } = useParams();
  return (
    <TenantProvider slug={slug}>
      <CartProvider>{children}</CartProvider>
    </TenantProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:slug" element={<Restaurant />} />
        <Route
          path="/:slug/menu"
          element={
            <TenantPageWrapper>
              <ExploreMenuPage />
            </TenantPageWrapper>
          }
        />
        <Route
          path="/:slug/cart"
          element={
            <TenantPageWrapper>
              <CartPage />
            </TenantPageWrapper>
          }
        />
        <Route path="/:slug/about" element={<About />} />
        <Route path="*" element={<Navigate to="/the-creamery" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

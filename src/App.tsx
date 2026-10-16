import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Useful from "./pages/Useful";
import ProductDetails from "./pages/ProductDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Delivery from "./pages/Delivery";
import About from "./pages/About";
import WatercolorDetail from "./pages/WatercolorDetail";
import WatercolorCatalog from "./pages/WatercolorCatalog";
import RemainsCatalog from "./pages/RemainsCatalog";
import RemainsDetail from "./pages/RemainsDetail";
import Spirit21Catalog from "./pages/Spirit21Catalog";
import Spirit21Detail from "./pages/Spirit21Detail";
import PhotographyCatalog from "./pages/PhotographyCatalog";
import PhotographyDetail from "./pages/PhotographyDetail";
import PhotographyPhotobook from "./pages/PhotographyPhotobook";
import Catalogs from "./pages/Catalogs";
import CatalogBook from "./pages/CatalogBook";
import Book from "./pages/Book";
import AllItems from "./pages/AllItems";
import HiddenItems from "./pages/HiddenItems";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <BrowserRouter>
    <LanguageProvider>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/slightlyusefulobject" element={<Useful />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/watercolors/:id" element={<WatercolorDetail />} />
            <Route path="/watercolor-catalog" element={<WatercolorCatalog />} />
            <Route path="/remains-catalog" element={<RemainsCatalog />} />
            <Route path="/remains/:id" element={<RemainsDetail />} />
            <Route path="/21spirit-catalog" element={<Spirit21Catalog />} />
            <Route path="/21spirit/:id" element={<Spirit21Detail />} />
            <Route path="/photography-catalog" element={<PhotographyCatalog />} />
            <Route path="/photography/:id" element={<PhotographyDetail />} />
            <Route path="/photography-photobook" element={<PhotographyPhotobook />} />
            <Route path="/catalogs" element={<Catalogs />} />
            <Route path="/catalogs/book" element={<CatalogBook />} />
            <Route path="/book" element={<Book />} />
            <Route path="/all-items" element={<AllItems />} />
            <Route path="/hidden-items" element={<HiddenItems />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </TooltipProvider>
    </CartProvider>
    </LanguageProvider>
    </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

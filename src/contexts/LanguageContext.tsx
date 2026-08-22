import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { translations, type Lang, type Translations } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "cw-lang";

const isLang = (value: string | null): value is Lang => value === "en" || value === "zh";

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [lang, setLangState] = useState<Lang>(() => {
    const fromUrl = searchParams.get("lang");
    if (isLang(fromUrl)) return fromUrl;
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return isLang(saved) ? saved : "en";
  });

  // useSearchParams' setSearchParams drops location.hash, which would break deep links
  // like /#products — build the next URL from location manually so the hash survives.
  const setLangParam = (next: Lang) => {
    const params = new URLSearchParams(location.search);
    params.set("lang", next);
    navigate(
      { pathname: location.pathname, search: params.toString(), hash: location.hash },
      { replace: true }
    );
  };

  const setLang = (next: Lang) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
    setLangParam(next);
  };

  const toggleLang = () => setLang(lang === "en" ? "zh" : "en");

  // Pick up ?lang= changes that didn't come from setLang (deep link nav, back/forward).
  useEffect(() => {
    const fromUrl = searchParams.get("lang");
    if (isLang(fromUrl) && fromUrl !== lang) {
      localStorage.setItem(STORAGE_KEY, fromUrl);
      setLangState(fromUrl);
    }
  }, [searchParams]);

  // Keep the URL in sync so the current language is always shareable as a link.
  useEffect(() => {
    if (searchParams.get("lang") !== lang) {
      setLangParam(lang);
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};

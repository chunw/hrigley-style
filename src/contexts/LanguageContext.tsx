import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [lang, setLangState] = useState<Lang>(() => {
    const fromUrl = searchParams.get("lang");
    if (isLang(fromUrl)) return fromUrl;
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return isLang(saved) ? saved : "en";
  });

  const setLang = (next: Lang) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("lang", next);
        return params;
      },
      { replace: true }
    );
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
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set("lang", lang);
          return params;
        },
        { replace: true }
      );
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

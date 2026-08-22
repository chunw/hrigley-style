import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-primary-foreground/20 text-center py-4" style={
          {opacity: 0.8}
        }>
          {/* <div className="space-y-6 pb-6">
            <p className="font-helvetica text-primary-foreground"></p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="lg"
                className="handwritten text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                @chunwang.art
              </Button>
            </a>
          </div> */}
          <p className="text-sm font-helvetica text-white" style={
          {fontSize: '0.8rem', }
        }>
            © {new Date().getFullYear()} Chun Wang Studio. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
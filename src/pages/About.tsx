import deliveryGif from "@/assets/delivery.gif";
import { artistBioProjects, artistBioSegments } from "@/lib/artistBio";
import { useLanguage } from "@/contexts/LanguageContext";

const linkStyle: React.CSSProperties = { color: "#d42b1a", textDecoration: "none" };

const ArtistBio = ({ lang }: { lang: "en" | "zh" }) => {
  const s = artistBioSegments[lang];
  const { negotiatedIntelligence, immemory } = artistBioProjects;
  return (
    <>
      {s.intro}
      <a href={negotiatedIntelligence.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {negotiatedIntelligence.name}
      </a>
      {s.mid}
      <a href={immemory.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {immemory.name}
      </a>
      {s.outro}
    </>
  );
};

const About = () => {
  const { lang, t } = useLanguage();
  return (
    <div
      id="about"
      style={{
        fontFamily: "'Space Mono', 'Courier New', monospace",
        fontSize: 16,
        background: "#ffffff",
        color: "#000000",
      }}
    >
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header bar */}
        <div
          style={{
            background: "#ffffff",
            padding: "28px 32px 20px",
            borderBottom: "1px solid #d42b1a",
          }}
        />

        {/* Body */}
        <div style={{ background: "#ffffff", padding: 32 }}>
          <div
            style={{
              fontFamily:
                "'CJK-Heiti', 'Gloria Hallelujah', 'Comic Sans MS', 'Bradley Hand', cursive",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: 24,
              color: "#000000",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {t.about.title}
          </div>

          <p
            style={{
              fontFamily: "'CJK-Heiti', Helvetica, Arial, sans-serif",
              fontSize: 12,
              color: "#000000",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {t.about.body}
          </p>

          {/* <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e0e0e0" }}>
            <div
              style={{
                fontFamily: "'CJK-Heiti', Helvetica, Arial, sans-serif",
                fontSize: 10,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: 12,
              }}
            >
              {t.about.artistLabel}
            </div>
            <p
              style={{
                fontFamily: "'CJK-Heiti', Helvetica, Arial, sans-serif",
                fontSize: 12,
                color: "#000000",
                letterSpacing: "1.5px",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              <ArtistBio lang={lang} />
            </p>
          </div> */}
        </div>

        {/* Delivery GIF */}
        <img
          src={deliveryGif}
          alt="Delivery animation"
          style={{ display: "block", width: "100%", height: "auto" }}
        />

        {/* Footer */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px 32px",
            borderTop: "1px solid #d42b1a",
          }}
        >
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              letterSpacing: "1.5px",
              fontFamily: "'CJK-Heiti', Helvetica, Arial, sans-serif",
            }}
          >
            <a
              href="https://www.chunwangshop.com/"
              style={{ color: "#d42b1a", textDecoration: "none", marginRight: 16 }}
            >
              {t.about.backToShop}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
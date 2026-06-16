import deliveryGif from "@/assets/delivery.gif";
import { useLanguage } from "@/contexts/LanguageContext";

const linkStyle: React.CSSProperties = {
  color: "#d42b1a",
  textDecoration: "none",
};

const BioEn = () => (
  <>
    Chun Wang is a multidisciplinary artist, technologist and curator working across photography,
    art, and creative web projects. Her work has been recognized through international awards such
    as International Photography Awards (1×), London International Creative Competition (4×), Siena
    International Photo Awards (1×), International Color Awards (5×), Moscow International Foto
    Award (1×), and Passepartout Photo Prize (1×). She has also published her work in books, and
    exhibited at art galleries worldwide along with leading institutions including the United
    Nations, SFMOMA, Stanford University and Harvard University. Her notable curatorial projects
    include{" "}
    <a href="https://negotiated-intelligence.org/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
      Negotiated Intelligence: Unearthing Power Dynamics in Human-AI Co-Creation
    </a>
    , part of The Wrong Biennale 2025–2026 edition, and{" "}
    <a href="https://covid-immemory.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
      IMMEMORY: On COVID-19
    </a>
    , an Official Nominee for 2021 Webby Awards in the Best Cultural Website category.
  </>
);

const BioZh = () => (
  <>
    王淳是一位跨领域艺术家、技术创作者与策展人，其创作横跨摄影、视觉艺术与创意网络项目。她的作品曾获多项国际奖项认可，包括：国际摄影奖（1次）、伦敦国际创意大赛（4次）、锡耶纳国际摄影奖（1次）、国际色彩奖（5次）、莫斯科国际摄影奖（1次）及Passepartout Photo Prize（1次）。她的作品已出版成书，并在全球多个画廊及艺术机构展出，包括联合国、旧金山现代艺术博物馆(SFMOMA)、斯坦福大学及哈佛大学。她的重要策展项目包括《
    <a href="https://negotiated-intelligence.org/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
      Negotiated Intelligence: Unearthing Power Dynamics in Human-AI Co-Creation
    </a>
    》，为The Wrong Biennale 2025–2026届参展项目；以及《
    <a href="https://covid-immemory.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
      IMMEMORY: On COVID-19
    </a>
    》，该项目获2021年韦比奖最佳文化网站类别官方提名。
  </>
);

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

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e0e0e0" }}>
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
              {lang === "zh" ? <BioZh /> : <BioEn />}
            </p>
          </div>
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
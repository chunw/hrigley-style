import deliveryGif from "@/assets/delivery.gif";

const About = () => {
  return (
    <div
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
                "'Gloria Hallelujah', 'Comic Sans MS', 'Bradley Hand', cursive",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: 24,
              color: "#000000",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            About the {" "}
            <span style={{ color: "#d42b1a" }}>Shop</span>
          </div>

          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 12,
              color: "#000000",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Based in New York City, our shop started as a collection of observations of the modern
            society that wouldn't leave us alone until they became physical
            things. We produce whimsical objects at the nexus of utility and comtempoary art,
            designed for people who want to see the world just a little differently. Feel
            free to stay as long as your curiosity allows.
          </p>
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
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            <a
              href="https://www.chunwangshop.com/"
              style={{ color: "#d42b1a", textDecoration: "none", marginRight: 16 }}
            >
              Back to Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
const deliveryHtml = `<!DOCTYPE html>
<!-- saved from url=(0065)file:///Users/chunwangpersonallaptop/Downloads/package-email.html -->
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Your Package Is On Its Way</title>

  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->

  <style>
    /* Reset */
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    /* Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');

    body {
      font-family: 'Space Mono', 'Courier New', monospace;
      font-size: 16px;
    }

    /* ===== ANIMATION SCENE ===== */
    .scene-wrapper {
      position: relative;
      width: 100%;
      max-width: 600px;
      height: 320px;
      overflow: hidden;
      background: #ffffff;
      margin: 0 auto;
    }

    .moon {
      position: absolute;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #d42b1a;
      animation: moonPulse 3s ease-in-out infinite;
      box-shadow: 0 0 40px 15px rgba(212,43,26,0.35), 0 0 90px 30px rgba(212,43,26,0.15);
    }
    @keyframes moonPulse {
      0%,100% { box-shadow: 0 0 40px 15px rgba(212,43,26,0.35), 0 0 90px 30px rgba(212,43,26,0.15); }
      50%      { box-shadow: 0 0 60px 25px rgba(212,43,26,0.55), 0 0 120px 50px rgba(212,43,26,0.25); }
    }

    .mountains-div {
      position: absolute;
      bottom: 126px;
      left: 0; right: 0;
      height: 80px;
    }

    .ground {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 130px;
      background: #ffffff;
    }
    .ground::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: #ffffff;
    }

    .track {
      position: absolute;
      bottom: 128px; left: 0; right: 0;
      height: 3px;
      background: #ffffff;
      animation: trackScroll 0.8s linear infinite;
    }
    @keyframes trackScroll {
      from { background-position: 0 0; }
      to   { background-position: -28px 0; }
    }

    /* Oil pump */
    .pump {
      position: absolute;
      bottom: 124px;
      left: 18px;
      width: 80px;
      height: 100px;
      animation: pumpBob 2s ease-in-out infinite;
      transform-origin: bottom center;
    }
    @keyframes pumpBob {
      0%,100% { transform: rotate(0deg); }
      50%      { transform: rotate(-1.5deg); }
    }

    /* Scattered boxes */
    .box-flat {
      position: absolute;
      bottom: 128px;
      left: 155px;
      width: 80px; height: 48px;
      background: #ffffff;
      border: 1.5px solid #000000;
      transform: rotate(-7deg);
      transform-origin: bottom left;
    }
    .box-flat-stripe {
      height: 8px;
      background: #d42b1a;
      margin-top: 18px;
    }
    .box-upright {
      position: absolute;
      bottom: 128px;
      right: 30px;
      width: 54px; height: 66px;
      background: #ffffff;
      border: 1.5px solid #000000;
      display: flex; align-items: center; justify-content: center;
    }

    /* Bear + box walking */
    .bear-group {
      position: absolute;
      bottom: 128px;
      animation: bearWalk 7s linear infinite;
    }
    @keyframes bearWalk {
      0%   { left: -160px; }
      100% { left: 660px; }
    }

    .amazon-box {
      position: relative;
      width: 68px; height: 42px;
      background: #ffffff;
      border: 1.5px solid #000000;
      border-radius: 1px;
    }
    .amazon-box-stripe {
      position: absolute;
      top: 50%; transform: translateY(-50%);
      left: 0; right: 0;
      height: 8px;
      background: #d42b1a;
    }
    .amazon-box-arrow {
      position: absolute;
      bottom: 5px; left: 50%;
      transform: translateX(-50%);
      font-size: 14px; color: #d42b1a;
      font-family: Arial, sans-serif;
      font-weight: 900; line-height:1;
    }
    .bear-svg {
      position: absolute;
      bottom: 38px;
      left: -4px;
      width: 76px;
      animation: bearBob 0.45s ease-in-out infinite alternate;
    }
    @keyframes bearBob {
      from { transform: translateY(0); }
      to   { transform: translateY(-4px); }
    }

    /* Scanlines */
    .scanlines {
      position: absolute; inset: 0;
      background: #ffffff;
      pointer-events: none;
    }

    /* Status bar inside scene */
    .scene-status {
      position: absolute;
      bottom: 14px; left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 90%;
    }
    .scene-status-text {
      font-family: 'Bebas Neue', 'Arial Narrow', Arial, sans-serif;
      font-size: 22px;
      color: #000000;
      letter-spacing: 5px;
      text-shadow: none;
      display: block;
      margin-bottom: 6px;
      animation: textFlicker 5s ease-in-out infinite;
    }
    @keyframes textFlicker {
      0%,88%,100% { opacity: 1; }
      90% { opacity: 0.8; }
      94% { opacity: 1; }
      97% { opacity: 0.85; }
    }
    .progress-track {
      width: 100%; height: 3px;
      background: #ffffff;
      border-radius: 2px; overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #d42b1a;
      box-shadow: 0 0 10px rgba(212,43,26,0.8);
      border-radius: 2px;
      animation: progressFill 7s linear infinite;
    }
    @keyframes progressFill {
      0%   { width: 10%; }
      100% { width: 100%; }
    }
    .progress-eta {
      font-family: 'Space Mono', 'Courier New', monospace;
      font-size: 12px;
      color: #000000;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 5px;
      display: block;
    }

    /* ===== EMAIL CHROME ===== */
    .email-wrapper {
      background-color: #ffffff;
      font-family: 'Space Mono', 'Courier New', monospace;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .email-header {
      background: #ffffff;
      padding: 28px 32px 20px;
      border-bottom: 1px solid #d42b1a;
    }
    .email-header-logo {
      font-family: 'Bebas Neue', 'Arial Narrow', Arial, sans-serif;
      font-size: 26px;
      letter-spacing: 6px;
      color: #d42b1a;
      text-decoration: none;
    }
    .email-header-subtitle {
      font-size: 12px;
      color: #000000;
      letter-spacing: 3px;
      margin-top: 3px;
      text-transform: uppercase;
    }
    .email-body {
      background: #ffffff;
      padding: 32px;
    }
    .email-greeting {
      font-size: 15px;
      color: #000000;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .email-headline {
      font-family: 'Bebas Neue', 'Arial Narrow', Arial, sans-serif;
      font-size: 36px;
      letter-spacing: 4px;
      color: #000000;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    .email-headline span { color: #d42b1a; }
    .email-body-text {
      font-size: 15px;
      line-height: 1.9;
      color: #000000;
      margin-bottom: 28px;
      letter-spacing: 0.5px;
    }

    /* Tracking info box */
    .tracking-box {
      border: 1px solid #d42b1a;
      background: #ffffff;
      padding: 18px 22px;
      margin-bottom: 28px;
    }
    .tracking-label {
      font-size: 12px;
      color: #000000;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .tracking-number {
      font-size: 20px;
      color: #000000;
      letter-spacing: 3px;
      font-weight: 700;
    }
    .tracking-row {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      gap: 10px;
    }
    .tracking-field { flex: 1; }
    .tracking-field-label {
      font-size: 11px;
      color: #000000;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .tracking-field-value {
      font-size: 14px;
      color: #000000;
      letter-spacing: 1px;
    }

    /* CTA Button */
    .cta-btn {
      display: inline-block;
      background: #d42b1a;
      color: #ffffff !important;
      text-decoration: none;
      font-family: Arial, sans-serif;
      font-size: 20px;
      letter-spacing: 4px;
      padding: 14px 36px;
      margin-bottom: 32px;
      transition: background 0.2s;
    }

    .divider {
      height: 1px;
      background: #d42b1a;
      margin: 20px 0;
    }

    .email-footer {
      background: #ffffff;
      padding: 24px 32px;
      border-top: 1px solid #d42b1a;
    }
    .footer-text {
      font-size: 12px;
      color: #000000;
      letter-spacing: 1.5px;
      line-height: 1.8;
      text-transform: uppercase;
    }
    .footer-links {
      margin-top: 10px;
      font-size: 12px;
      letter-spacing: 1.5px;
    }
    .footer-links a {
      color: #d42b1a;
      text-decoration: none;
      margin-right: 16px;
    }

    /* HOW TO USE notice */
    .how-to-use {
      background: #ffffff;
      border-left: 4px solid #d42b1a;
      padding: 14px 18px;
      font-family: 'Gloria Hallelujah', 'Comic Sans MS', cursive;
      font-size: 16px;
      color: #000000;
      margin: 20px auto;
      max-width: 600px;
    }
    .how-to-use strong { color: #d42b1a; }
    .how-to-use code { background: #ffffff; padding: 1px 5px; border-radius: 3px; font-size: 14px; }
  </style>
</head>
<body style="margin:0;padding:20px 0;background:#ffffff;">

  <!-- HOW TO SEND NOTICE (remove before sending) -->
  <div class="how-to-use">
    📬 <br>
    <br>
    Hi Mars, <br><br>
    您的包裹已寄出，tracking info如下。不好意思，最近纽约暴风雪，邮寄服务有所延迟！
    <br>
    <br>
    <br>
    
    祝好，
    <br>
    淳子 
    
  </div>

  <div class="email-wrapper">
    <div class="email-container">

      <!-- HEADER -->
      <div class="email-header">
        <div class="email-header-logo">CHUN WANG STUDIO</div>
        <div class="email-header-subtitle">Your package has been shipped</div>
      </div>

      <!-- ANIMATION SCENE -->
      <div class="scene-wrapper">

        <!-- Moon -->
        <div class="moon"></div>

        <!-- Mountains SVG -->
        <div class="mountains-div">
          <svg viewBox="0 0 600 80" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,80 80,14 160,80" fill="#000000"></polygon>
            <polygon points="60,80 140,6 220,80" fill="#d42b1a"></polygon>
            <polygon points="130,80 210,20 290,80" fill="#000000"></polygon>
            <polygon points="210,80 290,10 380,80" fill="#d42b1a"></polygon>
            <polygon points="300,80 370,18 450,80" fill="#000000"></polygon>
            <polygon points="390,80 460,8 540,80" fill="#d42b1a"></polygon>
            <polygon points="480,80 560,16 620,80" fill="#000000"></polygon>
            <polygon points="140,80 210,6 260,80" fill="rgba(212,43,26,0.1)"></polygon>
            <polygon points="290,80 370,10 420,80" fill="rgba(212,43,26,0.07)"></polygon>
          </svg>
        </div>

        <!-- Ground -->
        <div class="ground"></div>
        <div class="track"></div>

        <!-- Oil pump -->
        <div class="pump">
          <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="28" y="86" width="24" height="10" fill="#000000" rx="2"></rect>
            <rect x="35" y="44" width="10" height="50" fill="#000000"></rect>
            <circle cx="40" cy="44" r="6" fill="#000000"></circle>
            <rect x="6" y="38" width="68" height="8" fill="#000000" rx="2" transform="rotate(-15, 40, 42)"></rect>
            <rect x="56" y="26" width="20" height="16" fill="#d42b1a" rx="2" transform="rotate(-15, 40, 42)"></rect>
            <rect x="10" y="46" width="5" height="38" fill="#000000" transform="rotate(-15, 40, 42)"></rect>
            <!-- tiny amazon box on pump -->
            <rect x="46" y="30" width="16" height="11" fill="#d42b1a" rx="1"></rect>
            <text x="54" y="39" text-anchor="middle" font-size="6" fill="#ffffff" font-family="Arial" font-weight="bold">↗</text>
          </svg>
        </div>

        <!-- Flat open box -->
        <div class="box-flat">
          <div class="box-flat-stripe"></div>
        </div>

        <!-- Upright box -->
        <div class="box-upright">
          <svg width="30" height="18" viewBox="0 0 50 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 22 Q25 30 45 22" stroke="#d42b1a" stroke-width="4" fill="none" stroke-linecap="round"></path>
            <circle cx="44" cy="22" r="4" fill="#d42b1a"></circle>
          </svg>
        </div>

        <!-- Polar Bear with box -->
        <div class="bear-group">
          <!-- Amazon Box -->
          <div class="amazon-box">
            <div class="amazon-box-stripe"></div>
            <div class="amazon-box-arrow">↗</div>
          </div>
          <!-- Bear SVG -->
          <svg class="bear-svg" viewBox="0 0 76 62" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="38" cy="44" rx="22" ry="16" fill="#ffffff"></ellipse>
            <ellipse cx="38" cy="24" rx="16" ry="14" fill="#ffffff"></ellipse>
            <circle cx="27" cy="13" r="6" fill="#ffffff"></circle>
            <circle cx="49" cy="13" r="6" fill="#ffffff"></circle>
            <circle cx="27" cy="13" r="3.5" fill="#d42b1a"></circle>
            <circle cx="49" cy="13" r="3.5" fill="#d42b1a"></circle>
            <circle cx="33" cy="22" r="2.5" fill="#000000"></circle>
            <circle cx="43" cy="22" r="2.5" fill="#000000"></circle>
            <circle cx="33.8" cy="21.2" r="0.9" fill="white"></circle>
            <circle cx="43.8" cy="21.2" r="0.9" fill="white"></circle>
            <ellipse cx="38" cy="30" rx="7" ry="5" fill="#ffffff"></ellipse>
            <ellipse cx="38" cy="28.5" rx="3.2" ry="2" fill="#000000"></ellipse>
            <rect x="20" y="50" width="11" height="10" rx="4" fill="#ffffff" transform="rotate(-12,25.5,55)"></rect>
            <rect x="45" y="50" width="11" height="10" rx="4" fill="#ffffff" transform="rotate(12,50.5,55)"></rect>
          </svg>
        </div>

        <!-- Scanlines -->
        <div class="scanlines"></div>

        <!-- Status bar -->
        <div class="scene-status">
          <span class="scene-status-text">YOUR PACKAGE IS ON ITS WAY</span>
          <div class="progress-track">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-eta">Estimated Delivery · Beyond The Mountains</span>
        </div>

      </div>
      <!-- END SCENE -->

      <!-- EMAIL BODY -->
      <div class="email-body">

        <div class="email-greeting">Hello, SHUNYUAN</div>
        <div class="email-headline">Your order<br>is <span>en route.</span></div>

        <div class="email-body-text">
          Great news — your package has left our facility and is making its way to you across the tundra. 
           </div>

        <!-- Tracking box -->
        <div class="tracking-box">
          <div class="tracking-label">Tracking Number</div>
          <div class="tracking-number">TRK · 7X4-88201-NP</div>
          <div class="tracking-row">
            <div class="tracking-field">
              <div class="tracking-field-label">Shipped From</div>
              <div class="tracking-field-value">Arctic Facility 04</div>
            </div>
            <div class="tracking-field">
              <div class="tracking-field-label">Destination</div>
              <div class="tracking-field-value">[Your Address]</div>
            </div>
            <div class="tracking-field">
              <div class="tracking-field-label">Est. Arrival</div>
              <div class="tracking-field-value">[Delivery Date]</div>
            </div>
          </div>
        </div>

        <a href="file:///Users/chunwangpersonallaptop/Downloads/package-email.html#" class="cta-btn">Track Your Package</a>

        <div class="divider"></div>

        <div class="email-body-text" style="font-size:14px;margin-bottom:0;">
          Questions about your order? Reply to this email.
        </div>

      </div>

      <!-- FOOTER -->
      <div class="email-footer">
        <div class="footer-text">
          You're receiving this because you placed an order with us.<br>
          Chun Wang Studio · New York City, NY, USA
        </div>
        <!-- <div class="footer-links">
          <a href="file:///Users/chunwangpersonallaptop/Downloads/package-email.html#">Unsubscribe</a>
          <a href="file:///Users/chunwangpersonallaptop/Downloads/package-email.html#">Privacy Policy</a>
          <a href="file:///Users/chunwangpersonallaptop/Downloads/package-email.html#">Contact Us</a>
        </div> -->
      </div>

    </div>
  </div>



</body></html>`;

const Delivery = () => {
  return (
    <iframe
      title="Delivery"
      srcDoc={deliveryHtml}
      className="h-screen w-full border-0"
    />
  );
};

export default Delivery;
import deliveryGif from "@/assets/delivery.gif";
import deliveryJpg from "@/assets/delivery.jpg";
import deliveryExampleOrderPng from "@/assets/delivery_example order.png";

// UPDATE WITH REAL DATA BEFORE SENDING
const customerName = "[CUSTOMER NAME]";
const customerMessage = "Welcome to the studio!";
const trackingNumber = "[TRACKING NUMBER]";
const trackingLink = `https://www.chunwangshop.com/`;
const carrier = "USPS";
const estimatedArrival = "7-10 business days";
const itemName = "Remains Tote Bag";
const quantity = "1";
const customerMessageHtml = customerMessage.replace(/\n/g, "<br>");

const deliveryHtml = `<!DOCTYPE html>
<!-- saved from url=(0065)file:///Users/chunwangpersonallaptop/Downloads/package-email.html -->
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>About Chun Wang Studio Shop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap" rel="stylesheet">

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

    :root {
      --handwritten-font: 'Gloria Hallelujah', 'Comic Sans MS', 'Bradley Hand', 'Marker Felt', 'Chalkboard SE', cursive;
    }

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
      font-family: var(--handwritten-font);
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 24px;
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
      font-family: Helvetica, Arial, sans-serif;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0.05em;
      font-size: 16px;
      padding: 14px 36px;
      margin-bottom: 32px;
      transition: background 0.2s;
    }
    .cta-btn:link,
    .cta-btn:visited,
    .cta-btn:hover,
    .cta-btn:active {
      text-decoration: none !important;
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
      text-transform: none;
      font-family: Helvetica, Arial, sans-serif;
    }
    .footer-links {
      margin-top: 10px;
      font-size: 12px;
      letter-spacing: 1.5px;
      font-family: Helvetica, Arial, sans-serif;
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
      font-family: Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 2;
      color: #000000;
      margin: 0 auto;
      max-width: 600px;
    }
    .how-to-use * {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 2;
    }
    .how-to-use strong { color: #d42b1a; }
    .how-to-use code { background: #ffffff; padding: 1px 5px; border-radius: 3px; font-size: 16px; line-height: 1; }
  </style>
</head>
<body style="margin:0;padding:20px 0;background:#ffffff;">

<div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <div class="email-header-logo"></div>
        <div class="email-header-subtitle"></div>
      </div>
      <!-- EMAIL BODY -->
      <div class="email-body">
       
        <div class="email-greeting"><span style="font-family: Helvetica, Arial, sans-serif;"></span></div>
        <div class="email-headline">Welcome to Chun Wang <br> Studio <span>Shop</span></div>
          <div class="footer-text">
          Our shop started as a collection of observations of the modern society that wouldn't leave us alone until they became physical things.
          We produce whimsical objects at the nexus of art and utility for people who want to see the world just a little differently. 
         Feel free to stay as long as your curiosity allows.
        </div>   

       
      <div class="tracking-box" style="display:none; ">
          <div style="margin:0; background:#000000;padding-bottom:16px;">
            <img src="${deliveryJpg}" alt="Delivery" style="display:block;width:100%;height:auto;" />
          </div>
          <div style="background:#000000;border:1px solid #ffffff;padding:14px;">
            <div style="font-family: 'Space Mono', 'Courier New', monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ffffff;margin-bottom:10px;">
              <!-- Tracking Number: ${trackingNumber}
              <br>
              Carrier: ${carrier} · -->
              Est. Arrival: ${estimatedArrival}
            </div>
            <table style="display:none" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td valign="top" style="width:84px;padding-right:12px;">
                  <img src="${deliveryExampleOrderPng}" alt="Example order" style="display:block;width:100%;max-width:84px;height:auto;border:1px solid #d9d9d9;" />
                </td>
                <td valign="top" style="font-family: var(--handwritten-font);font-weight:400;letter-spacing:0.05em;color:#ffffff;text-transform:uppercase;">
                  <div style="font-size:18px;line-height:1.1;margin-bottom:4px;">Your Order</div>
                  <div style="font-size:12px;line-height:1.35;">Item: ${itemName}</div>
                  <div style="font-size:12px;line-height:1.35;">Quantity: ${quantity}</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

    
    </div>
  </div>

  <div class="how-to-use">
  
<img src="${deliveryGif}" alt="Delivery animation" style="display:block;width:100%;height:auto;" />
        
   <!-- FOOTER -->
      <div class="email-footer">
      
       <div class="footer-links">
         
           <a  href="#">Back to Shop</a>
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

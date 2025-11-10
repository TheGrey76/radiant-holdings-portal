import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  testEmail: string;
  subject: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testEmail, subject, content }: TestEmailRequest = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      throw new Error("Invalid email format");
    }

    console.log("Sending test email to:", testEmail);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6; 
              color: #e2e8f0;
              background: linear-gradient(135deg, #0f1729 0%, #1a2744 50%, #0d1424 100%);
              padding: 20px 0;
            }
            .email-wrapper { 
              max-width: 600px; 
              margin: 0 auto; 
              background: rgba(15, 23, 41, 0.95);
              border: 1px solid rgba(59, 130, 246, 0.2);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .test-banner {
              background: #f59e0b;
              color: #000;
              text-align: center;
              padding: 10px;
              font-weight: 600;
              font-size: 14px;
              letter-spacing: 1px;
            }
            .header { 
              background: linear-gradient(135deg, #0f1729 0%, #1a2744 50%, #2d3f5f 100%);
              padding: 50px 30px;
              text-align: center;
              border-bottom: 2px solid rgba(59, 130, 246, 0.3);
            }
            .logo { 
              color: #ffffff;
              font-size: 42px;
              font-weight: 300;
              letter-spacing: 8px;
              margin-bottom: 8px;
              text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
            }
            .tagline {
              color: #94a3b8;
              font-size: 13px;
              letter-spacing: 3px;
              text-transform: uppercase;
              font-weight: 300;
            }
            .content { 
              padding: 45px 35px;
              background: rgba(26, 39, 68, 0.4);
            }
            .greeting {
              font-size: 18px;
              color: #ffffff;
              margin-bottom: 25px;
              font-weight: 400;
            }
            .main-content {
              color: #cbd5e1;
              font-size: 15px;
              line-height: 1.8;
            }
            .main-content p {
              margin-bottom: 18px;
            }
            .main-content ul {
              margin: 25px 0;
              padding-left: 0;
              list-style: none;
            }
            .main-content li {
              margin-bottom: 16px;
              color: #cbd5e1;
              padding-left: 35px;
              position: relative;
            }
            .main-content li:before {
              content: "◆";
              position: absolute;
              left: 0;
              color: #3b82f6;
              font-size: 12px;
            }
            .main-content strong {
              color: #ffffff;
              font-weight: 600;
            }
            .feature-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 30px 0;
            }
            .feature-card {
              background: rgba(59, 130, 246, 0.08);
              border: 1px solid rgba(59, 130, 246, 0.2);
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .feature-icon {
              font-size: 40px;
              margin-bottom: 12px;
              color: #60a5fa;
              font-weight: 300;
              line-height: 1;
            }
            .feature-title {
              color: #60a5fa;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .feature-desc {
              color: #94a3b8;
              font-size: 12px;
              line-height: 1.5;
            }
            .highlight-box {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
              border-left: 4px solid #3b82f6;
              padding: 25px;
              margin: 30px 0;
              border-radius: 6px;
            }
            .stats-container {
              display: flex;
              justify-content: space-around;
              margin: 35px 0;
              padding: 25px;
              background: rgba(15, 23, 41, 0.6);
              border-radius: 8px;
              border: 1px solid rgba(59, 130, 246, 0.15);
            }
            .stat-item {
              text-align: center;
            }
            .stat-number {
              font-size: 28px;
              font-weight: 700;
              color: #60a5fa;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 11px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .cta-container {
              text-align: center;
              margin: 40px 0;
            }
            .cta-primary { 
              display: inline-block;
              padding: 18px 45px;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
              margin: 0 8px 15px 8px;
              transition: all 0.3s ease;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .signature {
              margin-top: 35px;
              padding-top: 25px;
              border-top: 1px solid rgba(59, 130, 246, 0.2);
            }
            .signature-name {
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 5px;
              font-size: 15px;
            }
            .signature-title {
              color: #94a3b8;
              font-size: 13px;
            }
            .footer { 
              background: rgba(15, 23, 41, 0.95);
              padding: 35px 30px;
              text-align: center;
              border-top: 1px solid rgba(59, 130, 246, 0.2);
            }
            .footer-content {
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.9;
            }
            .footer-links {
              margin-top: 20px;
            }
            .footer-link {
              color: #60a5fa;
              text-decoration: none;
              margin: 0 12px;
              font-size: 13px;
              font-weight: 500;
            }
            .contact-info {
              margin-top: 25px;
              padding-top: 25px;
              border-top: 1px solid rgba(59, 130, 246, 0.15);
            }
            @media only screen and (max-width: 600px) {
              .feature-grid { grid-template-columns: 1fr; }
              .stats-container { flex-direction: column; gap: 20px; }
              .cta-primary { display: block; margin: 10px 0; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="test-banner">⚠️ EMAIL DI TEST - NON INVIATA AI CLIENTI</div>
            <div class="header">
              <div class="logo">ARIES76</div>
              <div class="tagline">Capital Advisory</div>
            </div>
            
            <div class="content">
              <div class="greeting">Gentile Mario Rossi,</div>
              
              <div class="main-content">
                ${content}
              </div>
              
              <div class="signature">
                <div class="signature-name">Il Team ARIES76</div>
                <div class="signature-title">Capital Advisory - Structured Products Division</div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-content">
                <strong style="color: #ffffff; font-size: 15px;">ARIES76 Capital Advisory</strong><br>
                London, United Kingdom
              </div>
              
              <div class="footer-links">
                <a href="https://aries76.com" class="footer-link">Website</a>
                <span style="color: #475569;">•</span>
                <a href="https://aries76.com/structured-products" class="footer-link">Structured Products</a>
                <span style="color: #475569;">•</span>
                <a href="https://aries76.com/contact" class="footer-link">Contattaci</a>
              </div>
              
              <div class="contact-info">
                <div class="footer-content" style="font-size: 12px;">
                  <a href="mailto:info@aries76.com" style="color: #60a5fa; text-decoration: none;">info@aries76.com</a><br>
                  &copy; ${new Date().getFullYear()} ARIES76. Tutti i diritti riservati.
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: "ARIES76 Capital Advisory <info@aries76.com>",
      to: [testEmail],
      subject: `[TEST] ${subject}`,
      html: htmlContent,
    });

    console.log("Test email sent successfully to:", testEmail);

    return new Response(
      JSON.stringify({ success: true, message: "Test email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-test-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

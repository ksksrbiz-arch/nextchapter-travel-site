/**
 * email.ts — Transactional email via Resend
 *
 * Uses Resend's REST API directly (no SDK dependency).
 * Sends branded Next Chapter Travel emails.
 */

import { ENV } from "./_core/env";

const RESEND_API = "https://api.resend.com/emails";
// Use Resend's shared test domain until a custom domain is verified.
// Once jessica@nextchaptertravel.com is verified in Resend, update FROM_ADDRESS.
const FROM_ADDRESS = "Next Chapter Travel <onboarding@resend.dev>";

type SendResult = { success: true; id: string } | { success: false; error: string };

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendResult> {
  if (!ENV.resendApiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    const data = await res.json() as { id?: string; name?: string; message?: string };

    if (res.ok && data.id) {
      return { success: true, id: data.id };
    }
    return { success: false, error: data.message ?? `HTTP ${res.status}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

// ─── Invite Email ─────────────────────────────────────────────────────────────

export async function sendInviteEmail(opts: {
  to: string;
  clientName: string;
  inviteUrl: string;
  tripName?: string;
  expiresInDays?: number;
}): Promise<SendResult> {
  const { to, clientName, inviteUrl, tripName, expiresInDays = 7 } = opts;
  const firstName = clientName.split(" ")[0];
  const tripLine = tripName
    ? `<p style="margin:0 0 16px;">Your upcoming trip — <strong>${tripName}</strong> — is ready to explore in your personal travel portal.</p>`
    : `<p style="margin:0 0 16px;">Your personal travel portal is ready. All your trip details, itinerary, documents, and packing list are waiting for you.</p>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Travel Portal is Ready</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0a1628;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Next Chapter Travel</p>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:normal;line-height:1.3;">Your Journey Awaits</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;color:#1a1a1a;font-size:18px;">Dear ${firstName},</p>
              <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;font-family:Arial,sans-serif;">
                I'm so excited to be your travel advisor for this adventure! I've set up your personal travel portal where you can access everything you need for your trip.
              </p>
              <div style="color:#444;font-size:15px;line-height:1.7;font-family:Arial,sans-serif;">
                ${tripLine}
              </div>
              <p style="margin:0 0 32px;color:#444;font-size:15px;line-height:1.7;font-family:Arial,sans-serif;">
                Your portal includes your full itinerary, booking confirmations, packing checklist, destination guides, and a direct line to reach me anytime.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background:#c9a84c;border-radius:8px;padding:16px 40px;">
                    <a href="${inviteUrl}" style="color:#0a1628;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;display:block;">
                      Access Your Travel Portal →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#888;font-size:13px;font-family:Arial,sans-serif;text-align:center;">
                This invitation link expires in ${expiresInDays} days.
              </p>
              <p style="margin:0;color:#aaa;font-size:12px;font-family:Arial,sans-serif;text-align:center;word-break:break-all;">
                ${inviteUrl}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e8e0d0;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px;color:#1a1a1a;font-size:14px;font-family:Arial,sans-serif;font-weight:bold;">Jessica Seiders</p>
              <p style="margin:0 0 4px;color:#888;font-size:12px;font-family:Arial,sans-serif;">Certified Travel Advisor · Next Chapter Travel LLC</p>
              <p style="margin:0;color:#aaa;font-size:11px;font-family:Arial,sans-serif;">Disney · Cruises · Family Adventures · Luxury Travel</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Dear ${firstName},

Your travel portal is ready! ${tripName ? `Your trip "${tripName}" is all set.` : ""}

Access your portal here: ${inviteUrl}

This link expires in ${expiresInDays} days.

— Jessica Seiders
Next Chapter Travel LLC
  `.trim();

  return sendEmail({ to, subject: "Your Travel Portal is Ready ✈️", html, text });
}

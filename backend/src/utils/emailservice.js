import Mailjet from "node-mailjet";

// Initialize Mailjet client
function getMailjetClient() {
    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error(
            "Mailjet API credentials not configured. Set MAILJET_API_KEY and MAILJET_API_SECRET."
        );
    }

    return Mailjet.apiConnect(apiKey, apiSecret);
}

/**
 * SEND VERIFICATION EMAIL
 */
export async function sendVerificationEmail(
    recipientEmail,
    recipientName,
    verificationLink
) {
    try {
        const mailjet = getMailjetClient();

        const senderEmail =
            process.env.MAILJET_FROM_EMAIL ||
            process.env.SMTP_FROM ||
            "noreply@biscript.com";

        const senderName = process.env.MAILJET_FROM_NAME || "Biscript";

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; color:#333; }
  .container { max-width:600px; margin:auto; background:#f9f9f9; padding:20px; }
  .header { background:#111827; color:white; padding:20px; text-align:center; }
  .content { background:white; padding:30px; border:1px solid #ddd; }
  .button { display:inline-block; padding:12px 30px; background:#2563eb; color:white; text-decoration:none; border-radius:5px; font-weight:bold; }
  .footer { background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#666; }
</style>
</head>

<body>
<div class="container">
  <div class="header">
    <h1>Welcome to Biscript 🚀</h1>
  </div>

  <div class="content">
    <p>Hey <strong>${recipientName}</strong>,</p>

    <p>You’re almost ready to start using Biscript.</p>

    <center>
      <a href="${verificationLink}" class="button">Verify Email</a>
    </center>

    <p>If the button doesn’t work:</p>
    <p style="word-break:break-all;">${verificationLink}</p>

    <p>This link expires in 24 hours. If this wasn’t you, ignore this email.</p>

    <p><strong>— Team Biscript</strong></p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} Biscript</p>
    <p>Automated email. Do not reply.</p>
  </div>
</div>
</body>
</html>
`;

        const textContent = `
Welcome to Biscript 🚀

Hey ${recipientName},

Verify your email:
${verificationLink}

This link expires in 24 hours.

— Team Biscript
`;

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: senderEmail, Name: senderName },
                    To: [{ Email: recipientEmail, Name: recipientName }],
                    Subject: "Verify Your Biscript Account",
                    HTMLPart: htmlContent,
                    TextPart: textContent,
                },
            ],
        });

        console.log(
            "Verification email sent:",
            response.body.Messages[0].To[0].MessageUUID
        );
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Verification email failed");
    }
}

/**
 * SEND GENERIC EMAIL
 */
export async function sendEmail({
    to,
    subject,
    htmlContent,
    textContent,
    fromEmail,
    fromName,
}) {
    try {
        const mailjet = getMailjetClient();

        const senderEmail =
            fromEmail ||
            process.env.MAILJET_FROM_EMAIL ||
            "noreply@biscript.com";

        const senderName = fromName || process.env.MAILJET_FROM_NAME || "Biscript";

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: senderEmail, Name: senderName },
                    To: Array.isArray(to)
                        ? to.map((email) => ({ Email: email }))
                        : [{ Email: to }],
                    Subject: subject,
                    HTMLPart: htmlContent,
                    TextPart: textContent,
                },
            ],
        });

        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Email failed");
    }
}

/**
 * SEND PASSWORD RESET EMAIL
 */
export async function sendPasswordResetEmail(
    recipientEmail,
    recipientName,
    resetLink
) {
    try {
        const mailjet = getMailjetClient();

        const senderEmail =
            process.env.MAILJET_FROM_EMAIL ||
            "noreply@biscript.com";

        const senderName = process.env.MAILJET_FROM_NAME || "Biscript";

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; color:#333; }
  .container { max-width:600px; margin:auto; background:#f9f9f9; padding:20px; }
  .header { background:#dc2626; color:white; padding:20px; text-align:center; }
  .content { background:white; padding:30px; border:1px solid #ddd; }
  .button { display:inline-block; padding:12px 30px; background:#dc2626; color:white; text-decoration:none; border-radius:5px; font-weight:bold; }
  .footer { background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#666; }
</style>
</head>

<body>
<div class="container">
  <div class="header">
    <h1>Password Reset</h1>
  </div>

  <div class="content">
    <p>Hey <strong>${recipientName}</strong>,</p>

    <p>We received a request to reset your password.</p>

    <center>
      <a href="${resetLink}" class="button">Reset Password</a>
    </center>

    <p>If you didn’t request this, ignore this email.</p>

    <p>This link expires in 24 hours.</p>

    <p><strong>— Team Biscript</strong></p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} Biscript</p>
  </div>
</div>
</body>
</html>
`;

        const textContent = `
Password Reset

Hey ${recipientName},

Reset your password:
${resetLink}

If you didn’t request this, ignore this email.

— Team Biscript
`;

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: senderEmail, Name: senderName },
                    To: [{ Email: recipientEmail, Name: recipientName }],
                    Subject: "Reset Your Biscript Password",
                    HTMLPart: htmlContent,
                    TextPart: textContent,
                },
            ],
        });

        console.log("Reset email sent:", response.body.Messages[0].MessageUUID);
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Password reset email failed");
    }
}
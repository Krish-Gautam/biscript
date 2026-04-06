import fetch from "node-fetch";

const RESEND_API_KEY = "re_KiMHWo4u_PXbzJPxnucmJ9qB6Uwx6ETfa"; // your API key

async function sendEmail() {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "biscript15@gmail.com", // put your email here
      subject: "Test Email",
      html: "<p>It works 🚀</p>",
    }),
  });

  const data = await res.json();
  console.log(data);
}

sendEmail();
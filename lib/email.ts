import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { siteConfig, emailConfig } from "@/lib/config"

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export interface EmailOptions {
  to: string | string[]
  subject: string
  htmlContent: string
  textContent?: string
}

// Send a single email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, htmlContent, textContent } = options
  
  const toAddresses = Array.isArray(to) ? to : [to]
  const fromName = emailConfig.fromName
  const fromEmail = emailConfig.fromEmail
  
  const command = new SendEmailCommand({
    Source: `${fromName} <${fromEmail}>`,
    Destination: {
      ToAddresses: toAddresses,
    },
    ReplyToAddresses: [emailConfig.replyTo],
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlContent,
        },
        ...(textContent && {
          Text: {
            Charset: "UTF-8",
            Data: textContent,
          },
        }),
      },
    },
  })
  
  try {
    await sesClient.send(command)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Send bulk emails (for campaigns)
export async function sendBulkEmail(
  recipients: Array<{ email: string; name?: string }>,
  subject: string,
  htmlContent: string
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0
  
  // SES has a limit of 50 recipients per bulk send
  const batchSize = 50
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)
    
    // Send individual emails in batch (for personalization)
    const promises = batch.map(async (recipient) => {
      const personalizedHtml = htmlContent.replace(/{{name}}/g, recipient.name || "")
      
      const sent = await sendEmail({
        to: recipient.email,
        subject,
        htmlContent: personalizedHtml,
      })
      
      if (sent) {
        success++
      } else {
        failed++
      }
    })
    
    await Promise.all(promises)
    
    // Add small delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  
  return { success, failed }
}

// Email template for campaigns
export function createCampaignEmailTemplate(
  title: string,
  content: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  const siteUrl = siteConfig.url
  const fromName = emailConfig.fromName
  const footerText = emailConfig.templates.campaign.footerText
  const unsubscribeText = emailConfig.templates.campaign.unsubscribeText
  
  return `
<!DOCTYPE html>
<html dir="${siteConfig.direction}" lang="${siteConfig.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Heebo', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f1f5f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .content h2 {
      color: #0d9488;
      margin-top: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #0d9488;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${fromName}</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
      ${ctaText && ctaUrl ? `
        <p style="text-align: center;">
          <a href="${ctaUrl}" class="cta-button">${ctaText}</a>
        </p>
      ` : ""}
    </div>
    <div class="footer">
      <p>${footerText}</p>
      <p>
        <a href="${siteUrl}/unsubscribe">${unsubscribeText}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Lead notification email template
export function createLeadNotificationEmail(lead: {
  fullName: string
  email: string
  phone: string
  businessType?: string
  message?: string
}): string {
  return `
<!DOCTYPE html>
<html dir="${siteConfig.direction}" lang="${siteConfig.locale}">
<head>
  <meta charset="UTF-8">
  <title>ליד חדש!</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f1f5f9;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">🎉 ליד חדש התקבל!</h1>
    </div>
    <div style="padding: 30px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0d9488;">שם:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0d9488;">אימייל:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0d9488;">טלפון:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
        </tr>
        ${lead.businessType ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0d9488;">סוג עסק:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.businessType}</td>
        </tr>
        ` : ""}
        ${lead.message ? `
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #0d9488; vertical-align: top;">הודעה:</td>
          <td style="padding: 10px;">${lead.message}</td>
        </tr>
        ` : ""}
      </table>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// base email template - reused across all mail types
// takes a content object and returns full HTML string

export const baseTemplate = (content) => {

  // fallback colors if not passed
  const primaryColor = content.headerColor || '#1a237e'
  const darkColor = content.headerColorDark || '#0d1b4a'
  const btnColor = content.buttonColor || '#4CAF50'
  const company = content.companyName || 'Visitor Management System'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visitor Management System</title>
    <style>

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fc;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* header gradient changes based on email type */
        .email-header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 { font-size: 24px; margin-bottom: 8px; }
        .email-header p  { font-size: 14px; opacity: 0.9; }

        .email-body { padding: 30px; }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        .greeting strong { color: ${primaryColor}; }

        /* left border gives a nice accent to the message block */
        .main-message {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid ${primaryColor};
            font-size: 15px;
            line-height: 1.6;
            color: #555;
        }

        .details-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .details-title {
            font-size: 16px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }

        .detail-row {
            padding: 8px 0;
            display: flex;
            align-items: flex-start;
            border-bottom: 1px solid #f5f5f5;
        }

        .detail-label {
            width: 120px;
            font-weight: 600;
            color: #666;
            font-size: 13px;
        }

        .detail-value {
            flex: 1;
            color: #333;
            font-size: 13px;
        }

        .button {
            display: inline-block;
            background: ${btnColor};
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #e0e0e0;
        }
        .footer p { margin: 5px 0; }

        @media (max-width: 480px) {
            .email-body { padding: 20px; }
            .detail-label { width: 100px; }
        }

    </style>
</head>
<body>
<div class="email-container">

    <div class="email-header">
        <h1>${content.headerTitle}</h1>
        <p>${company}</p>
    </div>

    <div class="email-body">

        <div class="greeting">
            Dear <strong>${content.name}</strong>,
        </div>

        <div class="main-message">
            ${content.mainMessage}
        </div>

        ${content.detailsBlock}

        ${content.buttonText && content.buttonLink ? `
        <div style="text-align: center;">
            <a href="${content.buttonLink}" class="button" style="color: white;">
                ${content.buttonText}
            </a>
        </div>
        ` : ''}

    </div>

    <div class="footer">
        <p>© ${new Date().getFullYear()} ${company}. All rights reserved.</p>
        <p>${content.footerNote || 'This is an automated message, please do not reply.'}</p>
    </div>

</div>
</body>
</html>
  `
}


export const createDetailsBlock = (details) => {

  let rows = ''

  for (const [label, value] of Object.entries(details)) {
    // skip falsy values - no point rendering empty rows
    if (!value) continue

    rows += `
      <div class="detail-row">
          <div class="detail-label">${label}</div>
          <div class="detail-value">${value}</div>
      </div>
    `
  }

  return `
    <div class="details-card">
        <div class="details-title">📋 Details</div>
        ${rows}
    </div>
  `
}
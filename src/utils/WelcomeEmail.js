const getWelcomeEmailTemplate = (name, email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Shruti Banking</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0d6efd; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Shruti Banking</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                  <h2 style="color: #0d6efd; margin-top: 0;">Welcome aboard, ${name}! 👋</h2>
                  <p style="font-size: 16px;">We’re thrilled to have you with us. Your account has been successfully created and is ready for secure transactions.</p>
                  
                  <div style="background-color: #eef5ff; border-left: 4px solid #0d6efd; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; font-weight: 600; color: #0d6efd;">Quick Account Info:</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #555555;">Registered Email: <strong>${email}</strong></p>
                  </div>

                  <p style="font-size: 14px; color: #666666; margin-bottom: 0;">If you didn't request this registration, please contact our support team immediately.</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="font-size: 12px; color: #888888; margin: 0;">© 2026 Shruti Banking Ledger. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = getWelcomeEmailTemplate;
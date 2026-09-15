module.exports = function getHomeView() {
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f9fa; color: #333; border-radius: 10px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50;">🚀 Secure Pay Core Backend</h1>
            <p style="font-size: 16px; color: #555;">
                Successfully deployed on <strong>AWS EC2</strong> via <strong>Nginx Reverse Proxy</strong> & Automated <strong>CI/CD Pipeline</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="margin-bottom: 25px;">Explore interactive API docs or review automated deployment evidence:</p>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="/api-docs" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 15px; box-shadow: 0 2px 4px rgba(0,123,255,0.3);">
                    📄 Open Swagger Docs
                </a>
                
                <a href="/evidence" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 15px; box-shadow: 0 2px 4px rgba(40,167,69,0.3);">
                    🧪 View Test & CI/CD Proof
                </a>
            </div>

            <p style="margin-top: 30px; font-size: 12px; color: #888;">Status: Operational & Secure 🔒</p>
        </div>
    `;
};
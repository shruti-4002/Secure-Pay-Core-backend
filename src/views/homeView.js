module.exports = function getHomeView() {
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #f8f9fa; color: #333; border-radius: 12px; max-width: 700px; margin: 40px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">🚀 Secure Pay Core Backend</h1>
            <p style="font-size: 15px; color: #555; line-height: 1.5;">
                Production-grade Fintech Engine deployed on <strong>AWS EC2</strong> via <strong>Nginx Reverse Proxy</strong> & Automated <strong>CI/CD Pipeline</strong>.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            <p style="margin-bottom: 20px; font-weight: bold; color: #495057;">Explore API Documentation & Architectural Proofs:</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px;">
                <a href="/api-docs" style="background-color: #007bff; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0,123,255,0.2);">
                    📄 Open Swagger Docs
                </a>

                <a href="/evidence/cicd" style="background-color: #28a745; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(40,167,69,0.2);">
                    🧪 CI/CD & Testing Proofs
                </a>

                <a href="/evidence/workers" style="background-color: #6f42c1; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(111,66,193,0.2);">
                    ⚡ BullMQ & Queue Processing
                </a>

                <a href="/evidence/security" style="background-color: #fd7e14; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(253,126,20,0.2);">
                    🔒 Security, SSL & Idempotency
                </a>
            </div>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #777; margin-bottom: 8px;">Tech Stack Stacked & Verified:</p>
                <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px;">Node.js</span>
                <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px;">BullMQ / Redis</span>
                <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px;">AWS EC2</span>
                <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px;">Nginx & Certbot</span>
                <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px;">MongoDB</span>
            </div>
        </div>
    `;
};
module.exports = function getEvidenceView(type) {
    let content = "";
    let title = "";

    // 1. CI/CD & Testing Section Only
    if (type === "cicd") {
        title = "CI/CD & Automated Testing Evidence";
        content = `
            <h2 style="color: #3fb950;">CI/CD & Automated Testing Suites</h2>
            
            <div style="margin-bottom: 35px;">
                <h4 style="color: #79c0ff; text-align: left; max-width: 900px; margin: 0 auto 8px auto;">GitHub Actions Workflow Deployment</h4>
                <img src="/public/images/github-workflow-proof.png" alt="GitHub Actions Proof" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d;">
            </div>

            <div style="margin-bottom: 35px;">
                <h4 style="color: #79c0ff; text-align: left; max-width: 900px; margin: 0 auto 8px auto;">Jest Integration Test Suite</h4>
                <img src="/public/images/jest-proof.png" alt="Jest Suite Proof" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d;">
            </div>

            <div style="margin-bottom: 35px;">
                <h4 style="color: #79c0ff; text-align: left; max-width: 900px; margin: 0 auto 8px auto;">Supertest API Endpoints Test</h4>
                <img src="/public/images/supertest-proof.png" alt="Supertest Proof" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d;">
            </div>
        `;
    } 
    // 2. Queue Processing Section Only
    else if (type === "workers") {
        title = "Background Workers & Queue Evidence";
        content = `
            <h2 style="color: #d2a8ff;">Asynchronous Queue Processing & Email Notifications</h2>
            <p style="color: #8b949e; margin-bottom: 25px;">BullMQ Redis queue processing background job dispatch via Nodemailer.</p>

            <div style="margin-bottom: 35px;">
                <h4 style="color: #d2a8ff; text-align: left; max-width: 900px; margin: 0 auto 8px auto;">BullMQ Job Queue & Email Dispatch (Proof 1)</h4>
                <img src="/public/images/email-proof1.js.png" alt="BullMQ Email Worker Proof 1" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d;">
            </div>

            <div style="margin-bottom: 35px;">
                <h4 style="color: #d2a8ff; text-align: left; max-width: 900px; margin: 0 auto 8px auto;">Nodemailer Delivery Log (Proof 2)</h4>
                <img src="/public/images/email-proof2.js.png" alt="BullMQ Email Worker Proof 2" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d;">
            </div>
        `;
    } 
    // 3. Security Section Only (Grid Layout)
    else if (type === "security") {
        title = "Security, Idempotency & SSL Evidence";
        content = `
            <h2 style="color: #ffa657;">Security, Idempotency & SSL Certification</h2>
            <p style="color: #8b949e; margin-bottom: 30px;">HTTPS encryption, double payment prevention locks, and Role-Based Access Control (RBAC).</p>

            <!-- 2-COLUMN GRID FOR SECURITY CARDS -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; text-align: left;">
                
                <!-- CARD 1: HTTPS & SSL -->
                <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; justify: space-between;">
                    <div>
                        <h4 style="color: #ffa657; margin: 0 0 6px 0;">HTTPS & SSL Certificate (Certbot / Nginx)</h4>
                        <p style="color: #8b949e; font-size: 13px; margin: 0 0 12px 0; line-height: 1.4;">
                            Successfully configured free SSL/TLS certificates via Let's Encrypt and automated auto-renewal, enabling secure HTTPS traffic routing through Nginx reverse proxy on AWS.
                        </p>
                    </div>
                    <img src="/public/images/https.png" alt="HTTPS SSL Verification Proof" style="width: 100%; border-radius: 6px; border: 1px solid #30363d; object-fit: cover;">
                </div>

                <!-- CARD 2: DOUBLE PAYMENT / IDEMPOTENCY -->
                <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; justify: space-between;">
                    <div>
                        <h4 style="color: #ffa657; margin: 0 0 6px 0;">Double Payment Protection (Idempotency Key)</h4>
                        <p style="color: #8b949e; font-size: 13px; margin: 0 0 12px 0; line-height: 1.4;">
                            Idempotency key implementation preventing duplicate/concurrent transaction processing under heavy load conditions.
                        </p>
                    </div>
                    <img src="/public/images/double-payment.png" alt="Double Payment Proof" style="width: 100%; height:460px; border-radius: 6px; border: 1px solid #30363d; object-fit: cover;">
                </div>

                <!-- CARD 3: ADMIN RBAC -->
                <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; justify: space-between;">
                    <div>
                        <h4 style="color: #ffa657; margin: 0 0 6px 0;">Admin Privileges (Role-Based Access Control)</h4>
                        <p style="color: #8b949e; font-size: 13px; margin: 0 0 12px 0; line-height: 1.4;">
                            Strict RBAC route protection ensuring administrative actions are restricted strictly to authorized user roles.
                        </p>
                    </div>
                    <img src="/public/images/Admin-proof.js.png" alt="Admin RBAC Proof" style="width: 100%; border-radius: 6px; border: 1px solid #30363d; object-fit: cover;">
                </div>

                <!-- CARD 4: TOKEN BLACKLISTING -->
                <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; justify: space-between;">
                    <div>
                        <h4 style="color: #ffa657; margin: 0 0 6px 0;">Token Blacklisting / JWT Security</h4>
                        <p style="color: #8b949e; font-size: 13px; margin: 0 0 12px 0; line-height: 1.4;">
                            Redis-backed JWT revocation/blacklisting logic upon user logout to block stolen or invalidated session tokens.
                        </p>
                    </div>
                    <img src="/public/images/token-blacklist.png" alt="Token Blacklist Proof" style="width: 100%; border-radius: 6px; border: 1px solid #30363d; object-fit: cover;">
                </div>

            </div>
        `;
    }

    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #0d1117; color: #c9d1d9; min-height: 100vh;">
            <h1 style="color: #58a6ff;">🔍 ${title}</h1>
            
            <a href="/" style="color: #58a6ff; text-decoration: none; font-weight: bold; display: inline-block; margin-bottom: 30px;">⬅ Back to Main Page</a>

            <div style="margin-bottom: 40px;">
                ${content}
            </div>

            <p style="margin-top: 40px; font-size: 13px; color: #484f58;">Status: Production Ready, Secure & Architecturally Sound 🛡</p>
        </div>
    `;
};
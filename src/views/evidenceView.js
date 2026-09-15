module.exports = function getEvidenceView() {
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #0d1117; color: #c9d1d9; min-height: 100vh;">
            <h1 style="color: #58a6ff;">🔍 Automated Pipeline & Testing Evidence</h1>
            <p style="color: #8b949e;">End-to-End verification: GitHub Actions Workflow, Jest Unit Tests, and Supertest API Endpoint Suites.</p>
            
            <a href="/" style="color: #58a6ff; text-decoration: none; font-weight: bold; display: inline-block; margin-bottom: 30px;">⬅ Back to Home</a>

            <!-- Proof 1: GitHub Actions Workflow -->
            <div style="margin-bottom: 45px;">
                <h3 style="color: #79c0ff; text-align: left; max-width: 900px; margin: 0 auto 12px auto;">1. GitHub Actions: Automated CI/CD Workflow</h3>
                <p style="text-align: left; max-width: 900px; margin: 0 auto 15px auto; color: #8b949e; font-size: 14px;">Shows the successful execution of the 'Build, Test, and Deploy' pipeline triggered on every 'main' branch push.</p>
                <img src="/public/images/github-workflow-proof.png" alt="GitHub Workflow Proof" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d; box-shadow: 0 4px 16px rgba(0,0,0,0.6);">
            </div>

            <!-- Proof 2: Jest Tests -->
            <div style="margin-bottom: 45px;">
                <h3 style="color: #3fb950; text-align: left; max-width: 900px; margin: 0 auto 12px auto;">2. Jest: Unit & Integration Test Suite</h3>
                <p style="text-align: left; max-width: 900px; margin: 0 auto 15px auto; color: #8b949e; font-size: 14px;">Snapshot of Jest test execution, verifying core application logic and data model validations.</p>
                <img src="/public/images/jest-proof.png" alt="Jest Test Proof" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d; box-shadow: 0 4px 16px rgba(0,0,0,0.6);">
            </div>

            <!-- Proof 3: Supertest -->
            <div style="margin-bottom: 45px;">
                <h3 style="color: #fca326; text-align: left; max-width: 900px; margin: 0 auto 12px auto;">3. Supertest: HTTP API Endpoint Verification</h3>
                <p style="text-align: left; max-width: 900px; margin: 0 auto 15px auto; color: #8b949e; font-size: 14px;">Output showing successful HTTP request/response validation across critical API endpoints (Auth, Transactions, Accounts).</p>
                <img src="/public/images/supertest-proof.png" alt="Supertest Proof" style="max-width: 900px; width: 100%; border-radius: 8px; border: 1px solid #30363d; box-shadow: 0 4px 16px rgba(0,0,0,0.6);">
            </div>

            <p style="margin-top: 50px; font-size: 12px; color: #484f58;">Status: Operational, Tested & Continuous Deployed 🛡</p>
        </div>
    `;
};
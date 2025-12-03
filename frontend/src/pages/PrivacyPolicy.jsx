import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl shadow-md p-8 border border-gray-800">
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">1.1 Account Information</h3>
                  <p>When you create an account, we collect:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Email address</li>
                    <li>Username</li>
                    <li>Password (encrypted)</li>
                    <li>Profile picture (optional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">1.2 OAuth Information</h3>
                  <p>When you sign in with Google or GitHub, we collect:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Your name and email from your OAuth provider</li>
                    <li>Profile picture (if available)</li>
                    <li>OAuth provider ID (for account linking)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">1.3 User Content</h3>
                  <p>We collect content you post on our platform:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Cases you submit</li>
                    <li>Comments and replies</li>
                    <li>Votes on cases</li>
                    <li>Media files you upload</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">1.4 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage patterns and analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Authenticate your account and prevent fraud</li>
                <li>Send you important updates and notifications</li>
                <li>Improve our platform and user experience</li>
                <li>Calculate and distribute earnings</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="mb-4">We do NOT sell your personal information. We may share your information with:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Other Users:</strong> Your username, profile picture, cases, comments, and votes are public</li>
                <li><strong>Service Providers:</strong> Cloud storage (Cloudinary), email services (Resend), hosting (Railway, Hostinger)</li>
                <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
              <p className="mb-4">We take security seriously:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Passwords are encrypted using bcrypt</li>
                <li>Data is stored on secure servers</li>
                <li>HTTPS encryption for all communications</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access your personal data</li>
                <li>Update or correct your information</li>
                <li>Delete your account (contact us)</li>
                <li>Export your data (contact us)</li>
                <li>Opt-out of marketing emails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
              <p>We use cookies to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns</li>
                <li>Improve site performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
              <p className="mb-4">We use the following third-party services:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Google OAuth:</strong> For authentication</li>
                <li><strong>GitHub OAuth:</strong> For authentication</li>
                <li><strong>Cloudinary:</strong> For media storage</li>
                <li><strong>Resend:</strong> For email delivery</li>
                <li><strong>Railway:</strong> For backend hosting</li>
                <li><strong>Hostinger:</strong> For frontend hosting</li>
              </ul>
              <p className="mt-4">Each service has its own privacy policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
              <p>Our service is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:privacy@askjury.com" className="text-primary hover:underline">privacy@askjury.com</a>
              </p>
            </section>

            <section className="pt-8 border-t border-gray-700">
              <Link to="/" className="text-primary hover:underline">
                ← Back to Home
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

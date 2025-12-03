import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl shadow-md p-8 border border-gray-800">
          <h1 className="text-4xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using AskJury ("the Platform"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use the Platform.
              </p>
              <p className="mt-4">
                These Terms apply to all visitors, users, and others who access or use the Platform, including those who contribute
                content, vote, comment, or participate in any way.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts and Registration</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.1 Account Creation</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>You must be at least 13 years old to use this Platform</li>
                    <li>You must provide accurate and complete information during registration</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You are responsible for all activities that occur under your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.2 Account Security</h3>
                  <p>
                    You must immediately notify us of any unauthorized use of your account or any other breach of security.
                    We will not be liable for any loss or damage arising from your failure to comply with this security obligation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.3 One Account Per Person</h3>
                  <p>
                    You may not create multiple accounts to manipulate voting, evade bans, or abuse the Platform.
                    Violation of this rule may result in permanent suspension of all your accounts.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Content and Conduct</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.1 Content Ownership</h3>
                  <p>
                    You retain ownership of the content you post on the Platform. However, by posting content, you grant us a
                    worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content
                    on the Platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.2 Content Standards</h3>
                  <p className="mb-2">All content you post must comply with the following standards:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Must not be illegal, fraudulent, or deceptive</li>
                    <li>Must not violate any third-party rights (copyright, trademark, privacy, etc.)</li>
                    <li>Must not contain hate speech, discrimination, or harassment</li>
                    <li>Must not contain graphic violence, sexual content, or child exploitation</li>
                    <li>Must not promote illegal activities or self-harm</li>
                    <li>Must not contain spam, malware, or phishing attempts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.3 Respectful Behavior</h3>
                  <p>
                    Users must treat each other with respect. Personal attacks, doxxing, brigading, and coordinated harassment
                    are strictly prohibited. We encourage healthy debate and disagreement, but it must be civil.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Voting and Commenting Rules</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">4.1 Fair Voting</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Vote manipulation through bots, multiple accounts, or coordination is prohibited</li>
                    <li>You may change your vote within 24 hours of casting it</li>
                    <li>Votes on closed cases are not allowed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">4.2 Comment Guidelines</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Comments must be relevant to the case being discussed</li>
                    <li>Upvote helpful comments, downvote spam or rule-breaking content</li>
                    <li>Do not brigade comment sections or coordinate mass upvoting/downvoting</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Case Submission Guidelines</h2>
              <div className="space-y-4">
                <p>When submitting a case:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide accurate and truthful information</li>
                  <li>Choose the appropriate category for your case</li>
                  <li>Do not submit duplicate cases</li>
                  <li>Do not include personal information of others without consent</li>
                  <li>Media uploads must comply with our content standards</li>
                  <li>Cases may be closed after 7 days or when voting reaches 90%+ consensus with 50+ votes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="mb-4">
                The Platform, including its design, logos, trademarks, and code, is owned by AskJury and protected by
                intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the Platform
                without our explicit permission.
              </p>
              <p>
                If you believe your intellectual property rights have been violated on the Platform, please contact us with
                details of the alleged infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Earnings and Rewards</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">7.1 Comment Earnings</h3>
                  <p>
                    Users earn $1 for every 1,000 upvotes received on their comments. Upvotes must be legitimate and not obtained
                    through manipulation or fraud.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">7.2 Case Earnings</h3>
                  <p>
                    Case owners earn $0.001 per net favorable vote (votes for - votes against) if Side A (their side) wins.
                    Cases must have a valid verdict to qualify for earnings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">7.3 Earnings Disclaimers</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Earnings are virtual and for gamification purposes</li>
                    <li>We reserve the right to modify or discontinue the earnings system at any time</li>
                    <li>Fraudulent earnings will be reversed and may result in account termination</li>
                    <li>Earnings may be converted to real currency in the future, but this is not guaranteed</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Prohibited Activities</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Use the Platform for any illegal purpose or to violate any laws</li>
                <li>Impersonate any person or entity</li>
                <li>Attempt to gain unauthorized access to the Platform or other users' accounts</li>
                <li>Use automated scripts, bots, or scraping tools without permission</li>
                <li>Interfere with or disrupt the Platform's functionality</li>
                <li>Collect or harvest personal data from other users</li>
                <li>Sell, rent, or transfer your account to another party</li>
                <li>Use the Platform to distribute viruses, malware, or harmful code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
              <div className="space-y-4">
                <p>
                  We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason,
                  including but not limited to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Violation of these Terms</li>
                  <li>Engaging in prohibited activities</li>
                  <li>Fraudulent behavior or abuse of the Platform</li>
                  <li>Extended period of inactivity</li>
                  <li>Legal or regulatory requirements</li>
                </ul>
                <p className="mt-4">
                  You may delete your account at any time by contacting us. Upon termination, your right to use the Platform
                  will immediately cease, but certain provisions of these Terms will survive termination.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Disclaimers and Limitations of Liability</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.1 "As Is" Service</h3>
                  <p>
                    The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied.
                    We do not guarantee that the Platform will be error-free, secure, or uninterrupted.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.2 User-Generated Content</h3>
                  <p>
                    We are not responsible for the accuracy, reliability, or legality of user-generated content. Opinions expressed
                    by users do not represent our views.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.3 Limitation of Liability</h3>
                  <p>
                    To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages arising out of or related to your use of the Platform, including but not
                    limited to loss of profits, data, or goodwill.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.4 Indemnification</h3>
                  <p>
                    You agree to indemnify and hold harmless AskJury and its affiliates from any claims, damages, or expenses
                    arising out of your use of the Platform or violation of these Terms.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law and Dispute Resolution</h2>
              <div className="space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
                  regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising out of or related to these Terms or the Platform shall be resolved through binding arbitration,
                  except where prohibited by law. You agree to waive your right to participate in class actions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the
                updated Terms on this page and updating the "Last updated" date. Your continued use of the Platform after changes
                constitute your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:legal@askjury.com" className="text-primary hover:underline">legal@askjury.com</a>
              </p>
            </section>

            <section className="pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-500 mb-4">
                By using AskJury, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
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

export default TermsOfService;

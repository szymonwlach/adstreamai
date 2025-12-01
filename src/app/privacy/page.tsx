// PrivacyPolicy.tsx
import { CircleChevronLeft } from "lucide-react";
import React from "react";

interface PrivacyPolicyProps {
  companyName?: string;
  contactEmail?: string;
  lastUpdated?: string;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  companyName = "AdStreamAI",
  contactEmail = "contact@adstreamai.com",
  lastUpdated = "December 1, 2025",
}) => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-5 left-5">
        <a
          href="/#footer"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <CircleChevronLeft size={30} />
        </a>
      </div>
      <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last Updated: {lastUpdated}</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Introduction
            </h2>
            <p className="leading-relaxed mb-4">
              Welcome to {companyName} ("we," "us," "our," or "Service"). We
              respect your privacy and are committed to protecting your personal
              data. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our AI-powered
              advertising platform.
            </p>
            <p className="leading-relaxed">
              By using {companyName}, you agree to the collection and use of
              information in accordance with this Privacy Policy. If you do not
              agree with our policies and practices, please do not use our
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              2.1 Information You Provide to Us
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">
                  Account Information:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name and email address</li>
                  <li>Company name (if applicable)</li>
                  <li>Password (encrypted)</li>
                  <li>Billing and payment information</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">
                  Content You Upload:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Product photos and images</li>
                  <li>Product descriptions and details</li>
                  <li>Brand assets and logos</li>
                  <li>Any other content you choose to upload</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">
                  Social Media Account Information:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Access tokens for connected platforms (TikTok, Instagram,
                    Facebook, YouTube, LinkedIn)
                  </li>
                  <li>Platform account usernames and profile information</li>
                  <li>Permissions granted to our Service</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">
                  Communication Data:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Customer support inquiries</li>
                  <li>Feedback and survey responses</li>
                  <li>Email correspondence with us</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              2.2 Information We Collect Automatically
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">Usage Data:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pages and features accessed</li>
                  <li>Time spent on the platform</li>
                  <li>Click patterns and navigation paths</li>
                  <li>Ad creation and scheduling activities</li>
                  <li>Campaign performance metrics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">
                  Device and Technical Information:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device type and operating system</li>
                  <li>Time zone and language settings</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">
                  AI-Generated Content Data:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Videos and ads created through our platform</li>
                  <li>Editing and customization history</li>
                  <li>Performance analytics of distributed content</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              2.3 Information from Third-Party Platforms
            </h3>
            <p className="leading-relaxed mb-3">
              When you connect social media accounts, we may receive:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Account verification status</li>
              <li>Profile information</li>
              <li>Posting permissions and capabilities</li>
              <li>Analytics and engagement metrics from your posts</li>
              <li>Audience demographic data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. How We Use Your Information
            </h2>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              3.1 Service Delivery
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Create and maintain your account</li>
              <li>Generate AI-powered video advertisements</li>
              <li>Optimize content for different social media platforms</li>
              <li>Schedule and autopost content to connected platforms</li>
              <li>Provide cross-platform distribution services</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              3.2 Service Improvement
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Analyze usage patterns to improve our AI algorithms</li>
              <li>Enhance platform features and functionality</li>
              <li>Train and improve our AI models</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analytics</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              3.3 Communication
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Send service-related notifications</li>
              <li>Provide customer support</li>
              <li>
                Send promotional materials and updates (with your consent)
              </li>
              <li>Respond to your inquiries and requests</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              3.4 Security and Legal Compliance
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Prevent fraud and abuse</li>
              <li>Ensure platform security</li>
              <li>Comply with legal obligations</li>
              <li>Enforce our Terms & Conditions</li>
              <li>Protect our rights and property</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              3.5 Business Operations
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process payments and transactions</li>
              <li>Maintain records for accounting purposes</li>
              <li>Conduct internal business analysis</li>
              <li>Manage our business relationships</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. How We Share Your Information
            </h2>
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-6">
              <p className="leading-relaxed font-medium text-blue-300">
                We do not sell your personal information.
              </p>
            </div>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              4.1 Third-Party Service Providers
            </h3>
            <p className="leading-relaxed mb-3">
              We share data with trusted service providers who help us operate
              our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cloud hosting providers (for data storage)</li>
              <li>Payment processors (for billing)</li>
              <li>
                <strong className="text-white">
                  AI content generation services (for creating videos)
                </strong>
              </li>
              <li>Analytics providers</li>
              <li>Customer support tools</li>
              <li>Email service providers</li>
            </ul>
            <p className="leading-relaxed mt-4 text-slate-400">
              These providers are contractually obligated to protect your data
              and use it only for the services they provide to us.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              4.2 Social Media Platforms
            </h3>
            <p className="leading-relaxed mb-3">
              When you authorize posting to social media platforms, we share:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>AI-generated video content</li>
              <li>Captions, hashtags, and metadata</li>
              <li>Scheduling information</li>
              <li>Necessary authentication tokens</li>
            </ul>
            <p className="leading-relaxed mt-4 text-slate-400">
              Each platform's use of this information is governed by their own
              privacy policies.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              4.3 Legal Requirements
            </h3>
            <p className="leading-relaxed mb-3">
              We may disclose your information if required to do so by law or in
              response to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Court orders or legal processes</li>
              <li>Government or regulatory requests</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or illegal activity</li>
              <li>Enforcement of our Terms & Conditions</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              4.4 Business Transfers
            </h3>
            <p className="leading-relaxed">
              If {companyName} is involved in a merger, acquisition, or sale of
              assets, your information may be transferred as part of that
              transaction. We will notify you of any such change in ownership or
              control of your personal information.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              4.5 With Your Consent
            </h3>
            <p className="leading-relaxed">
              We may share your information for other purposes with your
              explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. AI and Machine Learning
            </h2>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              5.1 How We Use AI
            </h3>
            <p className="leading-relaxed mb-3">
              {companyName} uses third-party AI services to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Generate video content from product photos</li>
              <li>Create captions and hashtags optimized for each platform</li>
              <li>Adapt content style based on your selected preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              5.2 Content Review
            </h3>
            <p className="leading-relaxed">
              While our AI generates content automatically, we do not manually
              review your content unless required for security, legal
              compliance, or customer support purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Data Retention
            </h2>
            <p className="leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our
              Service and fulfill the purposes outlined in this Privacy Policy:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Account Information:</strong>{" "}
                Retained while your account is active and for a reasonable
                period afterward for legal compliance
              </li>
              <li>
                <strong className="text-white">Uploaded Content:</strong>{" "}
                Retained while your account is active or until you delete it
              </li>
              <li>
                <strong className="text-white">AI-Generated Content:</strong>{" "}
                Retained according to your storage preferences and subscription
                plan
              </li>
              <li>
                <strong className="text-white">Usage Data:</strong> Typically
                retained for up to 2 years for analytics purposes
              </li>
              <li>
                <strong className="text-white">Payment Information:</strong>{" "}
                Retained as required for tax and accounting purposes
              </li>
            </ul>
            <p className="leading-relaxed mt-4">
              You can request deletion of your data by contacting us or closing
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Your Rights and Choices
            </h2>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.1 Access and Correction
            </h3>
            <p className="leading-relaxed">
              You can access and update your account information at any time
              through your account settings.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.2 Data Deletion
            </h3>
            <p className="leading-relaxed">
              You can request deletion of your personal data by contacting us.
              Note that some information may be retained as required by law or
              for legitimate business purposes.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.3 Data Portability
            </h3>
            <p className="leading-relaxed">
              You can request a copy of your data in a machine-readable format.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.4 Marketing Communications
            </h3>
            <p className="leading-relaxed">
              You can opt out of promotional emails by clicking the
              "unsubscribe" link in any marketing email or updating your
              communication preferences in your account settings.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.5 Cookie Preferences
            </h3>
            <p className="leading-relaxed">
              You can manage cookie preferences through your browser settings.
              Note that disabling certain cookies may affect platform
              functionality.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.6 Connected Platforms
            </h3>
            <p className="leading-relaxed">
              You can disconnect social media accounts at any time through your
              account settings. This will revoke our access to those platforms.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.7 Rights Under GDPR (EU Users)
            </h3>
            <p className="leading-relaxed mb-3">
              If you are in the European Economic Area, you have additional
              rights including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">
              7.8 Rights Under CCPA (California Users)
            </h3>
            <p className="leading-relaxed mb-3">
              If you are a California resident, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Know what personal information is collected</li>
              <li>Know whether personal information is sold or disclosed</li>
              <li>
                Opt out of the sale of personal information (we do not sell
                personal information)
              </li>
              <li>Request deletion of personal information</li>
              <li>Not be discriminated against for exercising your rights</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us at {contactEmail}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Data Security
            </h2>
            <p className="leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and assessments</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="leading-relaxed text-yellow-300">
                However, no method of transmission over the internet or
                electronic storage is 100% secure. We cannot guarantee absolute
                security of your data.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. International Data Transfers
            </h2>
            <p className="leading-relaxed mb-4">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. We ensure appropriate safeguards
              are in place for such transfers, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Standard contractual clauses approved by the European Commission
              </li>
              <li>Privacy Shield certification (where applicable)</li>
              <li>Other lawful transfer mechanisms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Children's Privacy
            </h2>
            <p className="leading-relaxed">
              {companyName} is not intended for users under the age of 18. We do
              not knowingly collect personal information from children. If you
              believe we have collected information from a child, please contact
              us immediately, and we will delete such information.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Third-Party Platform Integrations
            </h2>
            <p className="leading-relaxed mb-4">
              {companyName} may integrate with third-party social media
              platforms such as TikTok, Instagram, Facebook, YouTube, and
              LinkedIn to enable content publishing and analytics.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Data Shared:</strong> Only the
                necessary account information, authentication tokens, and
                AI-generated content needed to provide the Service.
              </li>
              <li>
                <strong className="text-white">Purpose:</strong> To schedule,
                publish, and analyze your content on connected platforms.
              </li>
              <li>
                <strong className="text-white">Platform Policies:</strong> Each
                platform's use of your information is governed by their own
                privacy policies. Users must comply with these policies when
                connecting accounts.
              </li>
              <li>
                <strong className="text-white">Revoking Access:</strong> You can
                disconnect any connected platform at any time via your account
                settings, which will revoke {companyName}'s access.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Third-Party Links and Services
            </h2>
            <p className="leading-relaxed">
              Our Service may contain links to third-party websites and
              services. We are not responsible for the privacy practices of
              these third parties. We encourage you to review their privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              13. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Posting the updated policy on our website</li>
              <li>
                Sending an email notification to your registered email address
              </li>
              <li>Displaying a prominent notice on the platform</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Your continued use of {companyName} after such notification
              constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              14. Contact Us
            </h2>
            <p className="leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-blue-400 font-medium">Email: {contactEmail}</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 mb-2">Effective Date: {lastUpdated}</p>
            <p className="text-slate-400">
              By using {companyName}, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

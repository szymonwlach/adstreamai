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
  lastUpdated = "December 27, 2025",
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
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Introduction
            </h2>
            <p className="leading-relaxed">
              Welcome to {companyName} ("we", "us", or "our"). We respect your
              privacy and are committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, and protect your
              information when you use our AI-powered advertising platform.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-white mt-4 mb-2">
              Information You Provide
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Name and email address</li>
              <li>Account credentials (encrypted)</li>
              <li>Uploaded media and content</li>
              <li>Connected social media account tokens</li>
              <li>Customer support communications</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-2">
              Information Collected Automatically
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Usage and interaction data</li>
              <li>Device and browser information</li>
              <li>IP address and approximate location</li>
            </ul>
          </section>

          {/* 3. How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. How We Use Your Information
            </h2>

            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Provide and operate the core functionality of the Service</li>
              <li>Create and manage user accounts</li>
              <li>
                Generate AI-assisted advertising content using user inputs
              </li>
              <li>Publish and schedule content to connected platforms</li>
              <li>Maintain platform security and reliability</li>
              <li>Provide customer support</li>
            </ul>

            <p className="mt-4 text-slate-400">
              We use aggregated and anonymized data solely to improve platform
              stability and user experience. We do not use personal data to
              train or improve AI or machine learning models.
            </p>
          </section>

          {/* 4. Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. How We Share Information
            </h2>

            <p className="font-medium text-blue-300 mb-2">
              We do not sell your personal information.
            </p>

            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                Service providers (hosting, payments, infrastructure) under
                strict confidentiality agreements
              </li>
              <li>
                Social media platforms when you explicitly authorize publishing
              </li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          {/* 5. AI Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Artificial Intelligence Usage
            </h2>

            <p className="leading-relaxed mb-3">
              {companyName} uses AI technologies to generate advertising content
              based solely on user-provided inputs such as images, text, and
              configuration settings.
            </p>

            <p className="leading-relaxed text-slate-400">
              Google user data obtained through Google APIs is not used to
              train, fine-tune, or improve any AI or machine learning models.
            </p>
          </section>

          {/* 6. Google API Services User Data */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Google API Services User Data
            </h2>

            <p className="leading-relaxed mb-3">
              AdStreamAI’s use and transfer of information received from Google
              APIs adheres to the Google API Services User Data Policy,
              including the Limited Use requirements.
            </p>

            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                Google user data is used solely to provide the functionality
                explicitly requested by the user.
              </li>
              <li>
                Google user data is not used for advertising, marketing, resale,
                or profiling.
              </li>
              <li>
                Google user data is not used to train or improve AI or machine
                learning models.
              </li>
              <li>
                Google user data is not shared with third parties except as
                necessary to provide the requested functionality and in
                compliance with Google policies.
              </li>
            </ul>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Data Retention
            </h2>

            <p className="leading-relaxed">
              We retain personal data only for as long as necessary to provide
              the Service or comply with legal obligations. Users may request
              deletion of their data at any time.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Your Rights
            </h2>

            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Access and update your data</li>
              <li>Request data deletion</li>
              <li>Withdraw consent</li>
              <li>Disconnect third-party integrations</li>
            </ul>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Data Security
            </h2>
            <p className="leading-relaxed">
              We use industry-standard security measures to protect your data,
              including encryption and access controls.
            </p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Children’s Privacy
            </h2>
            <p className="leading-relaxed">
              {companyName} is not intended for users under the age of 18. We do
              not knowingly collect data from children.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Contact Us
            </h2>
            <p>Email: {contactEmail}</p>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400">
            By using {companyName}, you agree to this Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

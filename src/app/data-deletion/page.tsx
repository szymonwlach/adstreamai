import { CircleChevronLeft } from "lucide-react";
import React from "react";

const DataDeletion = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="fixed top-5 left-5">
        <a
          href="/#footer"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <CircleChevronLeft size={30} />
        </a>
      </div>

      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-6">
          Data Deletion Instructions
        </h1>

        <p className="text-white text-lg mb-4">
          AdStreamAI respects your privacy and your right to control your data.
        </p>

        <p className="text-white text-lg mb-4">
          If you would like to request deletion of your personal data associated
          with your AdStreamAI account, please contact us via email:
        </p>

        <p className="text-lg">
          <a
            href="mailto:contact@adstreamai.com"
            className="text-blue-400 hover:underline"
          >
            contact@adstreamai.com
          </a>
        </p>

        <p className="text-white text-sm mt-6 opacity-80">
          Please include the email address associated with your account in your
          request. We will process your data deletion request within 30 days, in
          accordance with applicable data protection laws.
        </p>
      </div>
    </div>
  );
};

export default DataDeletion;

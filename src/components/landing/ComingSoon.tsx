"use client";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50">
      <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
      <p className="text-xl text-gray-300">
        Our platform is under development. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;

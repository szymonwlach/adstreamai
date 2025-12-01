import { Upload } from "lucide-react";
import React from "react";

export const DashboardHero = () => {
  return (
    <div className="w-3/4 mx-auto mt-32 flex">
      <div className="flex flex-row items-center">
        <Upload size={30} />
        <p>Upload a Photo of your Product</p>
      </div>
    </div>
  );
};

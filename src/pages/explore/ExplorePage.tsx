import React from "react";
import { useTranslation } from "react-i18next";

const ExplorePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("navigation.explore")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content will go here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-2">Sample Card</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This is a placeholder for your explore page content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

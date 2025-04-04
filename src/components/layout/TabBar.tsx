import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const TabBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = "/" + location.pathname.split("/")[1];

  const tabs = [
    { name: t("navigation.explore"), href: "/explore" },
    { name: t("navigation.explore"), href: "/explore2" },
    { name: t("navigation.explore"), href: "/explore3" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 px-2 sm:px-6 lg:px-8 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-4 md:space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "inline-flex items-center px-1 pt-1 pb-2 text-sm font-medium border-b-2",
                currentPath === tab.href
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
              )}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabBar;

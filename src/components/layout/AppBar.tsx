import React from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const AppBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // For RTL support
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          {/* Language Switcher */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-1 min-w-[8rem]"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
                  onClick={() => changeLanguage("en")}
                >
                  English
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
                  onClick={() => changeLanguage("fr")}
                >
                  Français
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
                  onClick={() => changeLanguage("ar")}
                >
                  العربية
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

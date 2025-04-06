import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import {
  Layout,
  BookOpen,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
  Navigation,
  UserCircle,
  Bookmark,
  School,
  UserRoundIcon
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { AppBar } from "./AppBar";
import TabBar from "./TabBar";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSectionProps {
  title: string;
  items: NavItem[];
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const normalNavigation: NavItem[] = [
    {
      name: t("navigation.explore"),
      href: "/explore",
      icon: Navigation,
    },
  ];

  const adminNavigation: NavItem[] = [
    {
      name: t("admin.userManagement"),
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "liste des écoles",
      href: "/school",
      icon: School ,
    },
    {
      name: "liste de présence",
      href: "/teacher",
      icon: UserRoundIcon,
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavSection: React.FC<NavSectionProps> = ({ title, items }) => (
    <div className="space-y-2">
      <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h2>
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
            "/" + location.pathname.split("/")[1] === item.href
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50"
          )}
        >
          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
          {item.name}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
          <a href="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="logo"
              className="h-12 w-auto object-contain"
            />
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 shadow-inner">
            <NavSection title={t("app.title")} items={normalNavigation} />
            {isAdmin && (
              <div className="mt-6">
                <NavSection title="Admin" items={adminNavigation} />
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-2 py-2">
                <UserCircle className="w-8 h-8 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.email}
                  </p>
                  <Button
                    variant="ghost"
                    className="flex items-center mt-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary p-0"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("auth.logout")}
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:ltr:left-0 lg:rtl:right-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-center flex-shrink-0 h-20 px-4 border-b dark:border-gray-700">
            <a href="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="logo"
                className="h-14 w-auto object-contain"
              />
            </a>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto">
            <NavSection title={t("app.title")} items={normalNavigation} />
            {isAdmin && <NavSection title="Admin" items={adminNavigation} />}
          </nav>
          <div className="flex flex-shrink-0 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-sm">
            <div className="flex items-center w-full">
              <UserCircle className="w-9 h-9 text-gray-400" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {user?.email}
                </p>
                <Button
                  variant="ghost"
                  className="flex items-center mt-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary p-0 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("auth.logout")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ltr:pl-64 lg:rtl:pr-64">
        <AppBar />
        <TabBar />
        <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

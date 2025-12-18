import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenuTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ size = "md" }: ThemeToggleProps) {
  const { appMode, toggleAppMode } = useMenuTheme();
  const isDark = appMode === "dark";

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <motion.button
      onClick={toggleAppMode}
      className={`${sizeClasses[size]} relative flex items-center justify-center rounded-xl bg-muted/60 backdrop-blur-sm border border-border/50 hover:bg-muted transition-colors`}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className={`${iconSizes[size]} text-primary`} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className={`${iconSizes[size]} text-amber-500`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

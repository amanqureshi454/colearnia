import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the type for each tour item
interface Type {
  name: string;
}

// Define the props for the Tab component
interface TabProps {
  className?: string;
  space?: string;
  tabColor?: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  type: Type[];
  layoutIdPrefix?: string;
}

export function Tab({
  className,
  space,
  currentTab,
  tabColor,
  setCurrentTab,
  type,
  layoutIdPrefix,
}: TabProps) {
  const items = type ? type.map((item) => item.name) : [];

  return (
    <div id="" className={cn("relative z-50 mb-6 sm:mb-2 sm:pt-2", className)}>
      <div className="flex w-max mx-auto items-center gap-3 sm:gap-1 bg-transparent backdrop-blur-lg py-2 px-2.5 rounded-md shadow-[0px_4px_9px_0px_#0000000D]">
        {items.map((item) => {
          const isActive = currentTab === item;
          return (
            <motion.div
              layout
              key={item}
              onClick={() => setCurrentTab(item)}
              className={cn(
                "relative cursor-pointer text-sm font-medium font-inter rounded-full transition-colors",
                space,
                " hover:text-primary",
                isActive && "bg-muted "
              )}
            >
              <span
                className={` capitalize ${
                  isActive ? "text-white" : "text-black"
                } leading-normal`}
              >
                {item}
              </span>
              {isActive && (
                <motion.div
                  layoutId={`${layoutIdPrefix ?? "lamp"}`}
                  className={`absolute inset-0 w-full ${tabColor} rounded-md -z-10`}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

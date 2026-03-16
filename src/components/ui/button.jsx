// src/components/ui/button.jsx

import React from "react";

export const Button = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={
          "relative inline-flex h-12 overflow-hidden rounded-lg p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300 ease-in-out cursor-pointer" +
          className
        }
        ref={ref}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0069A1_0%,#3b82f6_50%,#0069A1_100%)]" />
        <span
          className={
            "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-slate-900 px-8 py-3 text-lg font-medium text-blue-600 backdrop-blur-3xl transition-all duration-300 hover:bg-blue-600/10" +
              props.disabled && "opacity-50 cursor-not-allowed"
          }
        >
          {children}
        </span>
      </button>
    );
  }
);

// A primary variation for use in the Navbar/Form
export const PrimaryButton = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        disabled={props.disabled}
        className={
          `bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 cursor-pointer ${props.disabled && "opacity-70 bg-gray-300 hover:bg-gray-300 shadow-gray-400/50 cursor-not-allowed"}` + 
          className
        }
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const SecondaryButton = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={
          "bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/50 cursor-pointer" +
          className
        }
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const GradientButton = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={
          "bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 cursor-pointer" +
          className
        }
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);


export const SkeletonButton = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={
          "bg-gray-200 px-5 py-2 rounded-lg font-medium animate-pulse transition-all duration-300 w-24 h-24" +
          className
        }
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const ButtonCard = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={
          "text-white px-5 py-2 rounded-lg font-medium hover:scale-[1.05] transition-all duration-300 cursor-pointer " +
          className
        }
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);


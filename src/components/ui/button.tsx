import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
}

const variantClasses = {
  default: "bg-black text-white hover:bg-gray-800",
  outline: "border border-black text-black bg-white hover:bg-gray-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className = "",
  ...props
}) => (
  <button
    className={`px-4 py-2 rounded transition ${variantClasses[variant]} ${className}`}
    {...props}
  />
);

export default Button; 
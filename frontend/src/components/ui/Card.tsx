import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "small" | "medium" | "large";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "medium"
}) => {
  const baseClasses = "card";
  const variantClasses = {
    default: "card-default",
    elevated: "card-elevated",
    outlined: "card-outlined"
  };
  const paddingClasses = {
    none: "card-padding-none",
    small: "card-padding-small",
    medium: "card-padding-medium",
    large: "card-padding-large"
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;

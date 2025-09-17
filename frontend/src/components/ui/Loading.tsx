import React from "react";

export interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false
}) => {
  const sizeClasses = {
    small: "loading-small",
    medium: "loading-medium",
    large: "loading-large"
  };

  const containerClass = fullScreen ? "loading-fullscreen" : "loading-container";
  const spinnerClass = `loading-spinner ${sizeClasses[size]}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass}>
        <div className="spinner"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;

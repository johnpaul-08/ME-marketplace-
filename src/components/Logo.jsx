import React from "react";

const Logo = ({ className }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <img
        src="/logo.svg"
        alt="Logo"
        className="logo"
        width={60}
        height={60}
      />

      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "25px",
          fontWeight: "700",
          letterSpacing: "1px",
          color: "#461711",
        }}
      >
        ME Marketplace
      </span>
    </div>
  );
};

export default Logo;
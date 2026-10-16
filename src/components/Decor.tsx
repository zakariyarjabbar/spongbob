import type { CSSProperties } from "react";
export function Flower({
  className = "",
  color = "currentColor",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`flower ${className}`}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M48 39C18 4 11 33 34 47C-8 43 5 76 38 59C12 96 47 108 50 69C68 105 97 85 67 59C111 70 110 34 70 43C91 8 57-7 53 36"
        stroke={color}
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="51" cy="51" r="7" stroke={color} strokeWidth="3" />
    </svg>
  );
}
export function StarDoodle({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`star-doodle ${className}`}
      viewBox="0 0 70 70"
      fill="none"
    >
      <path
        d="m35 7 5 21 22-6-15 17 13 18-22-8-13 16 1-24L7 31l23-2Z"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="m37 21-3 23 15-6" stroke={color} strokeWidth="2" />
    </svg>
  );
}
export function Bubbles() {
  return (
    <div className="bubble-decoration" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

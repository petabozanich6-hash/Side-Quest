import React from "react";

export const Leaf = ({ className = "", color = "#6B8A5B", size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <path d="M50 90 Q 20 80, 15 50 Q 15 20, 50 10 Q 85 20, 85 50 Q 80 80, 50 90 Z" stroke={color} strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M50 90 L 50 10" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <path d="M50 25 L 35 32 M50 40 L 32 48 M50 55 L 34 62 M50 70 L 38 75" stroke={color} strokeWidth="1" opacity="0.4"/>
    <path d="M50 25 L 65 32 M50 40 L 68 48 M50 55 L 66 62 M50 70 L 62 75" stroke={color} strokeWidth="1" opacity="0.4"/>
  </svg>
);

export const Branch = ({ className = "", color = "#4A5D3A", size = 140 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} fill="none" opacity="0.5">
    <path d="M20 180 Q 60 160, 90 120 Q 120 80, 180 30" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="90" cy="120" rx="18" ry="9" fill={color} transform="rotate(-40 90 120)" opacity="0.8"/>
    <ellipse cx="130" cy="80" rx="18" ry="9" fill={color} transform="rotate(-30 130 80)" opacity="0.7"/>
    <ellipse cx="65" cy="150" rx="14" ry="7" fill={color} transform="rotate(-50 65 150)" opacity="0.6"/>
    <ellipse cx="155" cy="55" rx="15" ry="7" fill={color} transform="rotate(-25 155 55)" opacity="0.65"/>
    <ellipse cx="105" cy="100" rx="12" ry="6" fill={color} transform="rotate(-35 105 100)" opacity="0.55"/>
  </svg>
);

export const Fern = ({ className = "", color = "#4A5D3A", size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" opacity="0.4">
    <path d="M50 95 Q 50 60, 50 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {[80,70,60,50,40,30,20].map((y, i) => {
      const w = 25 - i*2.5;
      return <g key={i}><ellipse cx={50 - w/2} cy={y} rx={w/2} ry="4" fill={color} transform={`rotate(-30 ${50-w/2} ${y})`}/><ellipse cx={50 + w/2} cy={y} rx={w/2} ry="4" fill={color} transform={`rotate(30 ${50+w/2} ${y})`}/></g>;
    })}
  </svg>
);

export const Flower = ({ className = "", color = "#D4857A", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
    {[0,60,120,180,240,300].map(a => (
      <ellipse key={a} cx="20" cy="12" rx="4" ry="7" fill={color} transform={`rotate(${a} 20 20)`} opacity="0.8"/>
    ))}
    <circle cx="20" cy="20" r="3" fill="#D4A574"/>
  </svg>
);

export const Pet = ({ species = "fox", size = 120, happy = true }) => {
  const bodyColor = {
    fox: "#C77B5B", owl: "#8B6F47", turtle: "#6B8A5B", hedgehog: "#9B7E5C",
    fawn: "#D4A574", squirrel: "#B8755A", rabbit: "#E8E2D1", dragon: "#4A6D5A"
  }[species] || "#C77B5B";
  const accent = {
    fox: "#F5EFE0", owl: "#F5EFE0", turtle: "#D4A574", hedgehog: "#F5EFE0",
    fawn: "#F5EFE0", squirrel: "#F5EFE0", rabbit: "#D4857A", dragon: "#D4857A"
  }[species] || "#F5EFE0";

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="animate-bob">
      {/* Body */}
      <ellipse cx="60" cy="78" rx="34" ry="30" fill={bodyColor}/>
      {/* Belly */}
      <ellipse cx="60" cy="85" rx="22" ry="18" fill={accent} opacity="0.9"/>
      {/* Head */}
      <circle cx="60" cy="45" r="28" fill={bodyColor}/>
      {/* Ears */}
      {species === "fox" && (<>
        <path d="M38 32 L 32 15 L 48 25 Z" fill={bodyColor}/><path d="M82 32 L 88 15 L 72 25 Z" fill={bodyColor}/>
        <path d="M38 30 L 36 20 L 45 25 Z" fill={accent}/><path d="M82 30 L 84 20 L 75 25 Z" fill={accent}/>
      </>)}
      {species === "rabbit" && (<>
        <ellipse cx="45" cy="18" rx="7" ry="18" fill={bodyColor}/><ellipse cx="75" cy="18" rx="7" ry="18" fill={bodyColor}/>
        <ellipse cx="45" cy="20" rx="3" ry="12" fill={accent}/><ellipse cx="75" cy="20" rx="3" ry="12" fill={accent}/>
      </>)}
      {species === "owl" && (<>
        <circle cx="48" cy="42" r="10" fill={accent}/><circle cx="72" cy="42" r="10" fill={accent}/>
        <path d="M40 25 L 48 20 L 48 35 Z" fill={bodyColor}/><path d="M80 25 L 72 20 L 72 35 Z" fill={bodyColor}/>
      </>)}
      {species === "hedgehog" && (<>
        {[25,35,45,55,65,75,85,95].map(x => <path key={x} d={`M${x} 20 L ${x-2} 10 L ${x+2} 10 Z`} fill="#52473A"/>)}
      </>)}
      {species === "turtle" && (<>
        <ellipse cx="60" cy="78" rx="38" ry="26" fill="#6B8A5B"/>
        <path d="M30 78 Q 60 55, 90 78" stroke="#4A5D3A" strokeWidth="2" fill="none"/>
        <path d="M45 65 L 45 90 M60 60 L 60 95 M75 65 L 75 90" stroke="#4A5D3A" strokeWidth="1.5"/>
      </>)}
      {species === "dragon" && (<>
        <path d="M38 32 L 30 12 L 48 24 Z" fill={bodyColor}/><path d="M82 32 L 90 12 L 72 24 Z" fill={bodyColor}/>
        <path d="M80 70 Q 110 60, 115 35 Q 105 55, 90 60 Z" fill={bodyColor} opacity="0.9"/>
      </>)}

      {/* Eyes */}
      <g className={happy ? "animate-blink" : ""} style={{transformOrigin:"50px 48px"}}>
        <circle cx="50" cy="48" r="4" fill="#2A2822"/>
        <circle cx="51" cy="47" r="1.2" fill="#FBF7EC"/>
      </g>
      <g className={happy ? "animate-blink" : ""} style={{transformOrigin:"70px 48px"}}>
        <circle cx="70" cy="48" r="4" fill="#2A2822"/>
        <circle cx="71" cy="47" r="1.2" fill="#FBF7EC"/>
      </g>
      {/* Blush */}
      <ellipse cx="42" cy="56" rx="5" ry="3" fill="#D4857A" opacity="0.5"/>
      <ellipse cx="78" cy="56" rx="5" ry="3" fill="#D4857A" opacity="0.5"/>
      {/* Smile */}
      {happy
        ? <path d="M53 60 Q 60 66, 67 60" stroke="#2A2822" strokeWidth="2" fill="none" strokeLinecap="round"/>
        : <path d="M53 63 L 67 63" stroke="#2A2822" strokeWidth="2" strokeLinecap="round"/>}
      {/* Nose */}
      <ellipse cx="60" cy="54" rx="2" ry="1.5" fill="#2A2822"/>
    </svg>
  );
};

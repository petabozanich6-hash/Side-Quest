import React from "react";
import "./WritersAcademy.css";
export const academyTracks={
 junior:{label:"Junior Story Adventurers",age:"Ages 8–11",caption:"Open a book. Discover a world.",ink:"#244e77",paper:"#eaf2fa",gold:"#f0b95f"},
 teen:{label:"Teen Storymakers",age:"Ages 12–17",caption:"Find your voice. Write your world.",ink:"#5c365e",paper:"#f2e8f3",gold:"#e7bd86"},
 adult:{label:"The Author’s Studio",age:"Adults 18+",caption:"Make room for the story you want to tell.",ink:"#25334c",paper:"#f4ede2",gold:"#d8b57c"},
 academy:{label:"Writers’ Academy",age:"Three creative pathways",caption:"Every great story starts somewhere.",ink:"#25334c",paper:"#f4ede2",gold:"#d8b57c"}
};
export function academyTrack(id){return id==="english-creative-camp-junior-v1"?"junior":id==="english-creative-camp-senior-v1"?"teen":id==="english-author-studio-adult-v1"?"adult":"academy";}
export function AcademyArtwork({track="academy",className=""}){
 const t=academyTracks[track]||academyTracks.academy;
 return <svg className={"academy-art "+className} viewBox="0 0 300 210" aria-hidden="true" focusable="false">
 <rect width="300" height="210" rx="14" fill={t.ink}/>
 <circle cx="150" cy="96" r="77" fill="none" stroke={t.gold} strokeOpacity=".38"/>
 <circle cx="150" cy="96" r="66" fill="none" stroke={t.gold} strokeOpacity=".20" strokeDasharray="2 7"/>
 {track==="junior"?<g strokeLinejoin="round"><path d="M80 157Q112 131 150 152Q188 131 220 157L220 177Q185 151 150 176Q115 151 80 177Z" fill="#f9eed5" stroke={t.gold} strokeWidth="2"/><path d="M150 152V176" stroke="#b58e55" strokeWidth="2"/><path d="M105 138L124 89 143 118 163 67 193 138Z" fill="#92b6d4"/><path d="M154 88L163 67 173 91 166 87 161 93Z" fill="#f9eed5"/><path d="M115 138V107M103 126L115 106 127 126M185 137V111M174 129L185 111 196 129" fill="none" stroke="#f9eed5" strokeWidth="2"/><path d="M95 66L99 76 109 80 99 84 95 94 91 84 81 80 91 76ZM203 49L206 57 214 60 206 63 203 71 200 63 192 60 200 57Z" fill={t.gold}/></g>:track==="teen"?<g><path d="M100 168V95a50 50 0 0 1 100 0v73Z" fill="#34243f" stroke={t.gold} strokeWidth="3"/><path d="M111 160V95a39 39 0 0 1 78 0v65Z" fill="#b39ac5"/><path d="M132 75a17 17 0 1 0 21 21 18 18 0 0 1-21-21Z" fill="#f9eed5"/><path d="M114 160L141 119 153 137 172 112 189 160Z" fill="#5c365e"/><path d="M77 175Q116 154 150 175Q184 154 223 175L223 185Q182 168 150 191Q118 168 77 185Z" fill="#f9eed5" stroke={t.gold} strokeWidth="2"/><path d="M74 71l4 9 9 4-9 4-4 9-4-9-9-4 9-4ZM226 71l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill={t.gold}/></g>:<g><path d="M65 150Q105 130 150 151Q195 130 235 150V174Q193 154 150 176Q107 154 65 174Z" fill="#f4ede2" stroke={t.gold} strokeWidth="2"/><path d="M150 151V176M80 155Q111 145 137 156M163 156Q191 145 220 155" fill="none" stroke="#a68758" strokeWidth="2"/><path d="M131 143Q139 89 197 40Q201 77 174 99L151 112 170 106Q159 127 131 143Z" fill={t.gold}/><path d="M126 154Q147 110 193 48" stroke="#25334c" strokeWidth="2.5" fill="none"/><path d="M91 83h24M103 71v24M210 114h16M218 106v16" stroke={t.gold} strokeWidth="1.5"/><circle cx="105" cy="112" r="2" fill={t.gold}/><circle cx="186" cy="75" r="2" fill="#f4ede2"/></g>}
 </svg>;
}
export function AcademyHero({track="academy",title,children}){
 const t=academyTracks[track]||academyTracks.academy;
 return <header className={"academy-hero academy-track-"+track}><div className="academy-hero-copy"><p className="academy-wordmark">WRITERS’ ACADEMY</p><p className="academy-endorsement">by Side-Quest Learning</p><h2>{title||t.label}</h2><p className="academy-kicker">{t.age}</p><p>{children||t.caption}</p></div><AcademyArtwork track={track}/></header>;
}
export function AcademyProgrammeCard({track,children}){
 const t=academyTracks[track]||academyTracks.academy;
 return <div className={"academy-programme academy-track-"+track}><AcademyArtwork track={track}/><div><p className="academy-kicker">{t.age}</p><h3>{t.label}</h3><p className="academy-tagline">{t.caption}</p>{children}</div></div>;
}

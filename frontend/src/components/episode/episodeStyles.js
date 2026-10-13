export const EPISODE_CSS = `
.ep-wrap{margin:12px auto;max-width:780px;font-family:Georgia,"Iowan Old Style",serif}
.ep-screen{position:relative;border-radius:18px;overflow:hidden;border:4px solid #1e293b;background:#0f172a;aspect-ratio:16/9}
.ep-screen svg{position:absolute;inset:0;width:100%;height:100%}
.ep-diagram-overlay{position:absolute;left:5%;right:5%;top:5%;z-index:2;pointer-events:none}
.ep-diagram{width:100%}
.ep-diagram svg{position:relative!important;width:100%;height:auto;display:block;border-radius:10px;border:2px solid #1f3b2d;box-shadow:0 6px 0 rgba(0,0,0,.12)}
.ep-cap{position:absolute;left:0;right:0;bottom:0;background:rgba(15,23,42,.88);color:#fff;padding:10px 14px;font-size:clamp(13px,2.4vw,18px);min-height:3.4em;line-height:1.35}
.ep-cap b{color:#fde047}
.ep-title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(145deg,#1f3b2d,#14532d);color:#fff;text-align:center;padding:24px;gap:12px}
.ep-title h3{font-size:clamp(20px,4vw,32px);margin:0;max-width:16ch}
.ep-title p{margin:0;max-width:36ch;opacity:.92;font-size:clamp(14px,2.2vw,17px)}
.ep-btn{background:#fde047;color:#1f2937;border:0;border-radius:999px;padding:10px 24px;font-size:17px;font-weight:800;cursor:pointer}
.ep-btn:focus-visible,.ep-ctl button:focus-visible,.ep-choice:focus-visible{outline:3px solid #38bdf8;outline-offset:2px}
.ep-ctl{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}
.ep-ctl button{background:#e2e8f0;border:0;border-radius:10px;padding:8px 14px;font-size:14px;cursor:pointer;color:#0f172a}
.ep-ctl button:disabled{opacity:.45;cursor:not-allowed}
.ep-progress{margin:8px 0 4px}
.ep-progress-meta{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#475569;flex-wrap:wrap}
.ep-progress-title{font-weight:700;color:#1f3b2d}
.ep-progress-bar{height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin-top:4px}
.ep-progress-fill{height:100%;background:#1f3b2d;transition:width .25s ease}
.ep-interact{position:absolute;left:4%;right:4%;top:8%;background:rgba(255,255,255,.96);border:2px solid #1f3b2d;border-radius:14px;padding:12px;max-height:58%;overflow:auto}
.ep-interact-prompt{margin:0 0 10px;font-weight:700;color:#1f3b2d;font-size:clamp(14px,2.3vw,18px)}
.ep-choices{display:grid;gap:8px}
.ep-choice{text-align:left;border:2px solid #cbd5e1;background:#fff;border-radius:12px;padding:10px 12px;cursor:pointer;font-size:clamp(13px,2.1vw,16px);color:#0f172a}
.ep-choice-ok{border-color:#166534;background:#dcfce7}
.ep-choice-bad{border-color:#991b1b;background:#fee2e2}
.ep-feedback{margin-top:8px;border-radius:12px;padding:10px 12px;font-size:14px}
.ep-feedback p{margin:6px 0 0}
.ep-feedback-ok{background:#dcfce7;color:#14532d;border:1px solid #86efac}
.ep-feedback-bad{background:#ffedd5;color:#9a3412;border:1px solid #fdba74}
.ep-transition{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.55);color:#fff;font-size:clamp(18px,3vw,28px);font-weight:700}
.ep-hop{animation:epHop .5s ease-in-out infinite alternate}
.ep-idle{animation:epIdle 2.4s ease-in-out infinite}
.ep-mouth{transform-box:fill-box;transform-origin:center;animation:epMouth .22s ease-in-out infinite alternate}
.ep-blink{transform-box:fill-box;transform-origin:center;animation:epBlink 4s infinite}
.ep-arm-wave{transform-box:fill-box;transform-origin:50% 0;animation:epWave .5s ease-in-out infinite alternate}
.ep-glow{animation:epGlow 1s ease-in-out infinite alternate}
.ep-pop{animation:epPop .45s ease both}
.ep-fade{animation:epFade .4s ease both}
.ep-draw{stroke-dasharray:800;animation:epDraw .7s ease both}
.ep-hide{opacity:0}
@keyframes epHop{to{transform:translateY(-8px)}}
@keyframes epIdle{50%{transform:translateY(-3px)}}
@keyframes epMouth{to{transform:scaleY(.35)}}
@keyframes epBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes epWave{to{transform:rotate(-28deg)}}
@keyframes epGlow{to{opacity:.4}}
@keyframes epPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes epFade{from{opacity:0}to{opacity:1}}
@keyframes epDraw{from{stroke-dashoffset:800}to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){
  .ep-wrap *{animation:none!important}
  .ep-hide{opacity:1}
  .ep-progress-fill{transition:none}
}
@media (max-width:520px){
  .ep-interact{top:4%;max-height:64%;padding:10px}
  .ep-ctl button{padding:8px 10px;font-size:13px}
}
`;

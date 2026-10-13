import React from "react";

export default function NarrationControls({
  playing,
  muted,
  hasSpeech,
  canBack,
  canNext,
  onPlayPause,
  onBack,
  onNext,
  onRestart,
  onToggleMute,
  onToggleCaptions,
  captionsOn,
}) {
  return (
    <div className="ep-ctl" role="toolbar" aria-label="Episode controls">
      <button type="button" onClick={onBack} disabled={!canBack} aria-label="Previous step">
        Back
      </button>
      <button type="button" onClick={onPlayPause} aria-label={playing ? "Pause" : "Play"}>
        {playing ? "Pause" : "Play"}
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label="Next step">
        Next
      </button>
      <button type="button" onClick={onRestart} aria-label="Restart episode">
        Restart
      </button>
      {hasSpeech && (
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
        >
          {muted ? "Sound off" : "Sound on"}
        </button>
      )}
      <button
        type="button"
        onClick={onToggleCaptions}
        aria-pressed={captionsOn}
        aria-label={captionsOn ? "Hide captions" : "Show captions"}
      >
        {captionsOn ? "Captions on" : "Captions off"}
      </button>
    </div>
  );
}

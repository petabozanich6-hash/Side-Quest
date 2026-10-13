import React from "react";

export default function EpisodeProgress({ sceneIndex, sceneCount, beatIndex, beatCount, title }) {
  const scenePct = sceneCount ? ((sceneIndex + 1) / sceneCount) * 100 : 0;
  return (
    <div className="ep-progress" aria-label={`Scene ${sceneIndex + 1} of ${sceneCount}`}>
      <div className="ep-progress-meta">
        <span>
          Scene {Math.min(sceneIndex + 1, sceneCount)} / {sceneCount}
        </span>
        <span className="ep-progress-title">{title}</span>
        <span>
          Step {Math.min(beatIndex + 1, beatCount)} / {beatCount || 1}
        </span>
      </div>
      <div className="ep-progress-bar" aria-hidden="true">
        <div className="ep-progress-fill" style={{ width: `${scenePct}%` }} />
      </div>
    </div>
  );
}

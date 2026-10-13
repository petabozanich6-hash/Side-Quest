import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EpisodeScene from "./EpisodeScene";
import SpeechBubble from "./SpeechBubble";
import InteractivePause from "./InteractivePause";
import AnswerFeedback from "./AnswerFeedback";
import SceneTransition from "./SceneTransition";
import EpisodeProgress from "./EpisodeProgress";
import NarrationControls from "./NarrationControls";
import useSpeechNarration from "./useSpeechNarration";
import { presentationForStage } from "./stagePresentation";
import { EPISODE_CSS } from "./episodeStyles";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}

/**
 * Data-driven teaching episode player.
 * episode.format should be "teaching". Beats: narrate | diagram | interact | pause | conclude
 */
export default function EpisodePlayer({ episode, onComplete }) {
  const scenes = useMemo(() => episode?.scenes || [], [episode]);
  const presentation = presentationForStage(episode?.stage || "S2");
  const reducedMotion = useReducedMotion();
  const autoRef = useRef(true);
  const posRef = useRef({ scene: 0, beat: -1 });
  const genRef = useRef(0);
  const interactLockRef = useRef(false);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [talking, setTalking] = useState(false);
  const [transition, setTransition] = useState(null);
  const [diagram, setDiagram] = useState(null);
  const [caption, setCaption] = useState({ who: "pip", text: "" });
  const [interact, setInteract] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const { hasSpeech, speak, cancel } = useSpeechNarration({ muted, reducedMotion });

  const scene = scenes[sceneIndex] || null;
  const beats = useMemo(() => scene?.beats || [], [scene]);
  const started = beatIndex >= 0;

  const srLabel = useMemo(() => {
    const parts = [episode?.title, scene?.title, caption.text].filter(Boolean);
    return parts.join(". ");
  }, [episode?.title, scene?.title, caption.text]);

  const finishEpisode = useCallback(() => {
    setPlaying(false);
    setFinished(true);
    setTalking(false);
    autoRef.current = false;
    onComplete?.();
  }, [onComplete]);

  const moveTo = useCallback(
    (nextScene, nextBeat, { auto = true } = {}) => {
      cancel();
      genRef.current += 1;
      setTalking(false);
      setFeedback(null);
      const target = scenes[nextScene]?.beats?.[nextBeat];
      // Lock immediately so rapid Next cannot skip an interact beat before useEffect runs.
      if (target?.type === "interact") {
        interactLockRef.current = true;
        setInteract(target);
        if (target.who && target.text) setCaption({ who: target.who, text: target.text });
        auto = false;
      } else {
        interactLockRef.current = false;
        setInteract(null);
      }
      if (nextScene !== posRef.current.scene) {
        setTransition(scenes[nextScene]?.title || `Scene ${nextScene + 1}`);
        window.setTimeout(() => setTransition(null), reducedMotion ? 0 : 650);
      }
      posRef.current = { scene: nextScene, beat: nextBeat };
      setSceneIndex(nextScene);
      setBeatIndex(nextBeat);
      autoRef.current = auto;
      setPlaying(auto);
      setFinished(false);
    },
    [cancel, reducedMotion, scenes]
  );

  const advance = useCallback(() => {
    if (interactLockRef.current) return;
    const { scene: sIdx, beat: bIdx } = posRef.current;
    const currentBeats = scenes[sIdx]?.beats || [];
    if (bIdx + 1 < currentBeats.length) {
      moveTo(sIdx, bIdx + 1, { auto: true });
      return;
    }
    if (sIdx + 1 < scenes.length) {
      moveTo(sIdx + 1, 0, { auto: true });
      return;
    }
    posRef.current = { scene: sIdx, beat: currentBeats.length };
    setBeatIndex(currentBeats.length);
    finishEpisode();
  }, [finishEpisode, moveTo, scenes]);

  useEffect(() => {
    if (beatIndex < 0 || finished) return undefined;
    const beat = beats[beatIndex];
    if (!beat) return undefined;
    const myGen = genRef.current;
    const stillHere = () => myGen === genRef.current;

    cancel();
    setTalking(false);
    setFeedback(null);

    // Keep diagram only when the current beat supplies one (or explicitly keeps it).
    if (beat.diagram) setDiagram(beat.diagram);
    else if (beat.type !== "diagram") setDiagram(null);

    if (beat.type === "diagram") {
      setDiagram(beat.diagram || null);
      if (beat.who && beat.text) {
        setCaption({ who: beat.who, text: beat.text });
        if (!autoRef.current) return undefined;
        setTalking(true);
        speak(beat.who, beat.text, () => {
          if (!stillHere() || !autoRef.current) return;
          setTalking(false);
          advance();
        });
      } else if (autoRef.current) {
        const t = window.setTimeout(() => {
          if (stillHere() && autoRef.current) advance();
        }, reducedMotion ? 250 : 900);
        return () => clearTimeout(t);
      }
      return undefined;
    }

    if (beat.type === "interact") {
      setPlaying(false);
      autoRef.current = false;
      interactLockRef.current = true;
      setInteract(beat);
      if (beat.who && beat.text) setCaption({ who: beat.who, text: beat.text });
      return undefined;
    }

    if (beat.type === "pause") {
      setPlaying(false);
      autoRef.current = false;
      setCaption({
        who: beat.who || "juno",
        text: beat.text || "Pause when you need to. Press Play to continue.",
      });
      return undefined;
    }

    if (beat.type === "narrate" || beat.type === "conclude") {
      setCaption({ who: beat.who || "pip", text: beat.text || "" });
      if (!autoRef.current) return undefined;
      setTalking(true);
      speak(beat.who || "pip", beat.text || "", () => {
        if (!stillHere() || !autoRef.current) return;
        setTalking(false);
        advance();
      });
    }
    return undefined;
  }, [advance, beatIndex, beats, cancel, finished, reducedMotion, sceneIndex, speak]);

  const start = () => {
    interactLockRef.current = false;
    setDiagram(null);
    setFeedback(null);
    setInteract(null);
    setFinished(false);
    moveTo(0, 0, { auto: true });
  };

  const toggle = () => {
    if (!started || finished) return start();
    if (playing || talking) {
      cancel();
      setTalking(false);
      setPlaying(false);
      autoRef.current = false;
      return;
    }
    const beat = beats[beatIndex];
    if (beat?.type === "pause") {
      advance();
      return;
    }
    if (beat?.type === "interact") return;
    autoRef.current = true;
    setPlaying(true);
    // Re-trigger current beat speech by nudging beat index through moveTo
    moveTo(sceneIndex, beatIndex, { auto: true });
  };

  const back = () => {
    const { scene: sIdx, beat: bIdx } = posRef.current;
    if (bIdx > 0) moveTo(sIdx, bIdx - 1, { auto: false });
    else if (sIdx > 0) {
      const prevBeats = scenes[sIdx - 1]?.beats || [];
      moveTo(sIdx - 1, Math.max(0, prevBeats.length - 1), { auto: false });
    }
  };

  const next = () => {
    if (interactLockRef.current && !feedback) return;
    if (feedback) {
      interactLockRef.current = false;
      setInteract(null);
      setFeedback(null);
    }
    advance();
  };

  const onResolved = ({ correct }) => {
    if (!interact) return;
    setFeedback({
      correct,
      correctText: interact.feedback?.correct || "That matches the distances on the number line.",
      incorrectText:
        interact.feedback?.incorrect ||
        "Compare both distances from the original number before choosing.",
    });
  };

  if (!scenes.length) return null;

  const showTitle = !started || finished;

  return (
    <figure className="ep-wrap" data-testid="teaching-episode" data-stage={episode.stage || "S2"}>
      <style>{EPISODE_CSS}</style>

      <EpisodeProgress
        sceneIndex={finished ? scenes.length - 1 : Math.max(0, sceneIndex)}
        sceneCount={scenes.length}
        beatIndex={Math.max(0, beatIndex)}
        beatCount={beats.length || 1}
        title={scene?.title || episode.title}
      />

      <div className="ep-screen">
        <EpisodeScene
          bg={scene?.bg || "room"}
          speaker={caption.who}
          talking={talking && playing}
          bounce={presentation.showCharacterBounce && !reducedMotion}
          diagram={diagram}
          reducedMotion={reducedMotion}
          ariaLabel={srLabel}
        />

        {captionsOn && started && !showTitle && !interact && (
          <SpeechBubble who={caption.who} text={caption.text} visible />
        )}

        {interact && (
          <div>
            <InteractivePause
              prompt={interact.prompt}
              choices={interact.choices || []}
              correctIndex={interact.correct_index}
              onResolved={onResolved}
            />
            <div style={{ position: "absolute", left: "4%", right: "4%", bottom: "8%" }}>
              <AnswerFeedback
                visible={!!feedback}
                correct={feedback?.correct}
                correctText={feedback?.correctText}
                incorrectText={feedback?.incorrectText}
              />
              {feedback && (
                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <button
                    type="button"
                    className="ep-btn"
                    onClick={() => {
                      interactLockRef.current = false;
                      setInteract(null);
                      setFeedback(null);
                      advance();
                    }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <SceneTransition label={transition} active={!!transition} />

        {showTitle && (
          <div className="ep-title">
            <h3>{finished ? "Episode complete" : episode.title}</h3>
            <p>
              {finished
                ? episode.learning_intention || "You can replay any time."
                : episode.hook ||
                  "Press play when you are ready. Sound stays off until you turn it on."}
            </p>
            <button type="button" className="ep-btn" onClick={start}>
              {finished ? "Watch again" : "Play episode"}
            </button>
          </div>
        )}
      </div>

      <NarrationControls
        playing={playing || talking}
        muted={muted}
        hasSpeech={hasSpeech}
        canBack={started && (sceneIndex > 0 || beatIndex > 0)}
        canNext={started && !finished && !(interactLockRef.current && !feedback) && !(interact && !feedback)}
        onPlayPause={toggle}
        onBack={back}
        onNext={next}
        onRestart={start}
        onToggleMute={() => {
          cancel();
          setMuted((m) => !m);
        }}
        onToggleCaptions={() => setCaptionsOn((c) => !c)}
        captionsOn={captionsOn}
      />

      {episode.transcript && (
        <details className="mt-2 text-sm text-slate-700">
          <summary>Read the transcript</summary>
          <p className="mt-1 whitespace-pre-wrap">{episode.transcript}</p>
        </details>
      )}
      <figcaption className="mt-1 text-center text-sm italic text-stone-700">
        {episode.title}
        {episode.learning_intention ? ` — ${episode.learning_intention}` : ""}
      </figcaption>
    </figure>
  );
}

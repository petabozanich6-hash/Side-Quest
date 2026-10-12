import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Pet } from "../shared/Botanical";
import Furniture from "./Furniture";
import { ITEMS, placeAt } from "./roomLogic";
import { usePetDirector } from "./usePetDirector";

const HINTS = {
  bed: "Invite your pet to sleep here",
  toy: "Play with the yarn",
  bowl: "Share a snack",
  cushion: "Settle on the cushion",
  lamp: "Turn the lamp on or off",
  window: "Look out the window",
  plant: "Sniff the fern",
  bookshelf: "Look at the books",
  mobile: "Watch the mobile",
  rug: "A rug for the floor",
};

function snap(item, x, y) {
  const spec = ITEMS[item];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  if (!spec) return { x: 0.5, y: 0.66 };
  return {
    x: clamp(x, 0.1, 0.9),
    y: spec.wall ? clamp(y, 0.14, 0.34) : clamp(y, 0.56, 0.72),
  };
}

export default function RoomScene({
  room,
  species,
  hatched,
  editing,
  reduced,
  command,
  companion,
  onCommand,
  onPlacements,
  onLamp,
  selectedItem,
}) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [drag, setDrag] = useState(null);
  const { actor, trait } = usePetDirector({
    species,
    placements: room.placements,
    active: hatched && onScreen && pageVisible && !editing,
    reduced,
    command,
  });

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    const node = stageRef.current;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    if (node) observer.observe(node);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      observer.disconnect();
    };
  }, []);

  const theme = room.themeStyle || {};
  const colors = room.floorStyle?.colors || ["#E7D3B0", "#DCC39A", "#C9A97A"];
  const floor = `repeating-linear-gradient(90deg, ${colors[0]} 0 22px, ${colors[1]} 22px 44px, ${colors[2]} 44px 48px)`;
  const shown = room.placements.map((placement) => (
    drag?.item === placement.item ? { ...placement, x: drag.x, y: drag.y } : placement
  ));
  const invalid = drag ? !!placeAt(room, drag.item, drag.x, drag.y).error : false;

  const pointFromEvent = (event) => {
    const rect = stageRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };

  const dropOnFloor = (event) => {
    if (!editing || !selectedItem || event.target.closest(".furn")) return;
    const point = pointFromEvent(event);
    const result = placeAt(room, selectedItem, point.x, point.y);
    if (result.error) toast.error(result.error);
    else onPlacements(result.placements);
  };

  const nudge = (placement, dx, dy) => {
    const result = placeAt(room, placement.item, placement.x + dx, placement.y + dy);
    if (!result.error) onPlacements(result.placements);
  };

  return (
    <div
      ref={stageRef}
      className={`living-room ${reduced || !onScreen || !pageVisible ? "room-still" : ""} ${!onScreen || !pageVisible ? "is-paused" : ""} ${editing ? "is-editing" : ""}`}
      data-testid="living-room"
      onPointerDown={dropOnFloor}
      style={{ background: theme.sky || "#E7F6EC" }}
    >
      <div className="lr-sky" style={{ background: theme.sky }} />
      <div className="lr-wall" style={{ background: theme.wall }} />
      <div className="lr-floor" style={{ background: floor }} />
      <div className="lr-trim" style={{ background: theme.trim }} />
      {room.lampOn && <div className="lr-glow" />}
      {!room.lampOn && <div className="lr-dim" />}

      {shown.map((placement) => (
        <FurnitureButton
          key={placement.uid}
          placement={placement}
          room={room}
          editing={editing}
          selected={drag?.item === placement.item}
          invalid={invalid && drag?.item === placement.item}
          sky={theme.sky}
          onActivate={(event) => {
            event.stopPropagation();
            if (editing) return;
            if (placement.item === "lamp") onLamp(!room.lampOn);
            else if (["bed", "toy", "bowl", "cushion"].includes(placement.item)) onCommand(placement.item);
            else if (placement.item !== "rug") onCommand("look", placement.item);
          }}
          onPointerDown={(event) => {
            if (!editing) return;
            event.stopPropagation();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            const next = { item: placement.item, x: placement.x, y: placement.y };
            dragRef.current = next;
            setDrag(next);
          }}
          onPointerMove={(event) => {
            if (!editing || !dragRef.current || dragRef.current.item !== placement.item) return;
            const point = pointFromEvent(event);
            const next = { item: placement.item, ...snap(placement.item, point.x, point.y) };
            dragRef.current = next;
            setDrag(next);
          }}
          onPointerUp={(event) => {
            const current = dragRef.current;
            if (!editing || !current || current.item !== placement.item) return;
            dragRef.current = null;
            setDrag(null);
            const point = pointFromEvent(event);
            const result = placeAt(room, current.item, point.x, point.y);
            const moved = result.placements?.find((item) => item.item === current.item);
            const before = room.placements.find((item) => item.item === current.item);
            if (result.error) toast.error(result.error);
            else if (!before || before.x !== moved.x || before.y !== moved.y) onPlacements(result.placements);
          }}
          onRemove={() => onPlacements(room.placements.filter((item) => item.uid !== placement.uid))}
          onKeyDown={(event) => { if (editing) onArrow(event, placement, nudge); }}
        />
      ))}

      {hatched ? (
        <button
          type="button"
          className="pet-actor"
          data-testid="pet-actor"
          aria-label={`Say hello to your ${species}`}
          style={{
            left: `${actor.x * 100}%`,
            top: `${actor.y * 100}%`,
            transitionDuration: reduced ? "0ms" : `${actor.duration || 0}ms`,
            transitionProperty: "left, top",
            zIndex: 8,
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onCommand("pet")}
        >
          <span className="pet-shadow" />
          <span className="pet-hit" />
          {actor.say && <span className="pet-say">{actor.say}</span>}
          {actor.pose === "pet" && <span className="pet-heart" aria-hidden="true">♥</span>}
          <span className={`pet-flip ${actor.facing < 0 ? "is-left" : ""}`}>
            <span className={`pet-pose pose-${actor.pose} ${trait.hop ? "is-hop" : ""}`} style={{ animationDuration: `${trait.breathe}s` }} data-species={species}>
              <Pet species={species} size={148} happy={actor.pose !== "sleep"} resting={actor.pose === "sleep"} motion="room">{companion}</Pet>
            </span>
          </span>
        </button>
      ) : (
        <div className="pet-actor" style={{ left: "50%", top: "78%", width: "auto" }} data-testid="pet-actor">
          {companion}
        </div>
      )}
    </div>
  );
}

function onArrow(event, placement, nudge) {
  const step = 0.03;
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  nudge(placement, move[0], move[1]);
}

function FurnitureButton({ placement, room, editing, selected, invalid, sky, onActivate, onPointerDown, onPointerMove, onPointerUp, onRemove, onKeyDown }) {
  const spec = ITEMS[placement.item];
  if (!spec) return null;
  return (
    <div
      role="button"
      tabIndex={0}
      className={`furn ${selected ? "is-selected" : ""} ${invalid ? "is-invalid" : ""}`}
      data-testid={`furn-${placement.item}`}
      aria-label={editing ? `Move the ${spec.name}` : HINTS[placement.item] || spec.name}
      style={{
        left: `${(placement.x - spec.w / 2) * 100}%`,
        top: `${(placement.y - spec.h / 2) * 100}%`,
        width: `${spec.w * 100}%`,
        height: `${spec.h * 100}%`,
        zIndex: placement.item === "rug" ? 1 : spec.wall ? 2 : Math.max(3, Math.round(placement.y * 10)),
        touchAction: editing ? "none" : "auto",
      }}
      onClick={onActivate}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onActivate(event);
        onKeyDown(event);
      }}
    >
      <Furniture item={placement.item} lampOn={room.lampOn} sky={sky} />
      {editing && (
        <button
          type="button"
          className="furn-remove"
          aria-label={`Put the ${spec.name} back in the cupboard`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); onRemove(); }}
        >
          ×
        </button>
      )}
    </div>
  );
}

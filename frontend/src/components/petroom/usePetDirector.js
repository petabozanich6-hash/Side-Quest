import { useEffect, useRef, useState } from "react";
import { TRAITS, anchorFor, moveDuration, pathTo, pickWanderTarget } from "./roomLogic";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function usePetDirector({ species, placements, active, reduced, command }) {
  const trait = TRAITS[species] || TRAITS.fox;
  const [actor, setActor] = useState({ x: 0.56, y: 0.82, facing: 1, pose: "idle", say: "", duration: 0 });
  const actorRef = useRef(actor);
  actorRef.current = actor;
  const timers = useRef([]);
  const token = useRef(0);
  const holdUntil = useRef(0);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };

  const placementsRef = useRef(placements);
  placementsRef.current = placements;

  const follow = (target, poseAfter, say, linger) => {
    clearTimers();
    const my = ++token.current;
    const path = pathTo(actorRef.current, target);
    let delay = 0;
    path.forEach((point, index) => {
      const from = index === 0 ? actorRef.current : path[index - 1];
      const dist = Math.hypot(point.x - from.x, point.y - from.y);
      const ms = moveDuration(dist, trait.speed, reduced);
      const id = setTimeout(() => {
        if (token.current !== my) return;
        const current = actorRef.current;
        const facing = point.x < current.x - 0.012 ? -1 : point.x > current.x + 0.012 ? 1 : current.facing;
        const last = index === path.length - 1;
        setActor({
          x: point.x,
          y: point.y,
          facing,
          pose: last ? poseAfter : "walk",
          say: last ? say : "",
          duration: ms,
        });
      }, delay);
      timers.current.push(id);
      delay += Math.max(ms, 16);
    });
    if (linger !== Infinity) {
      const id = setTimeout(() => {
        if (token.current !== my) return;
        setActor((current) => ({ ...current, pose: "idle", say: "", duration: 0 }));
      }, delay + linger);
      timers.current.push(id);
    }
    holdUntil.current = Date.now() + delay + (linger === Infinity ? 18000 : linger);
  };

  useEffect(() => {
    if (!command) return undefined;
    const find = (item) => placementsRef.current.find((placement) => placement.item === item);
    const goItem = (item, pose, say, linger) => {
      const placed = find(item);
      follow(placed ? anchorFor(placed) : { x: 0.5, y: 0.82 }, pose, say, linger);
    };
    if (command.type === "pet") follow({ x: 0.5, y: 0.84 }, "pet", "Hi!", 1700);
    else if (command.type === "call") follow({ x: 0.5, y: 0.84 }, "look", "Coming!", 1500);
    else if (command.type === "celebrate") follow({ x: 0.5, y: 0.84 }, "celebrate", "Hooray!", 2400);
    else if (command.type === "toy") goItem("toy", "play", "Play!", 2600);
    else if (command.type === "bowl") goItem("bowl", "eat", "Yum", 2000);
    else if (command.type === "bed") goItem("bed", "sleep", "Zzz", Infinity);
    else if (command.type === "cushion") goItem("cushion", "sit", "", 3400);
    else if (command.type === "look") goItem(command.item, "look", "", 1700);
    return undefined;
  }, [command]);

  useEffect(() => {
    if (!active || reduced) return undefined;
    let stop = false;
    let timer = 0;
    const loop = () => {
      const wait = 3400 + Math.random() * 4200 * (1.4 - trait.wander);
      timer = setTimeout(() => {
        if (stop) return;
        const current = actorRef.current;
        if (Date.now() < holdUntil.current || current.pose === "walk") {
          loop();
          return;
        }
        const roll = Math.random();
        const placed = placementsRef.current;
        const toy = placed.find((placement) => placement.item === "toy");
        const bed = placed.find((placement) => placement.item === "bed");
        const cushion = placed.find((placement) => placement.item === "cushion");
        const prefer = placed.find((placement) => placement.item === trait.prefer);
        if (toy && roll < trait.play * 0.42) follow(anchorFor(toy), "play", "", 2200);
        else if (bed && roll < trait.rest * 0.34) follow(anchorFor(bed), "sleep", "", 6400);
        else if (cushion && roll < trait.rest) follow(anchorFor(cushion), "sit", "", 2600);
        else if (prefer && roll < 0.62) follow(anchorFor(prefer), "look", "", 1500);
        else if (roll < trait.wander) {
          const spot = pickWanderTarget(placed, current, Math.random);
          if (spot) follow(spot, "idle", "", 800);
        } else {
          setActor((pet) => ({ ...pet, pose: pet.pose === "look" ? "idle" : "look", say: "" }));
        }
        loop();
      }, wait);
    };
    loop();
    return () => {
      stop = true;
      clearTimeout(timer);
      clearTimers();
    };
  }, [active, reduced, species]);

  return { actor, trait };
}

import { LEVEL_LABELS } from "../utils/subjects";

// Three bars that fill to show difficulty. The word is always shown beside it,
// so meaning never depends on the graphic alone.
export default function LevelMeter({ level }) {
  return (
    <span className="level">
      <span className="level-bars" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= level ? "bar on" : "bar"} style={{ height: `${6 + n * 4}px` }} />
        ))}
      </span>
      <span>{LEVEL_LABELS[level]}</span>
    </span>
  );
}

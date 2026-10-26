import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";

const STORAGE_KEY = "open-shelf.saved.v1";
const VALID_STATUS = ["todo", "doing", "done"];

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const clean = {};
    for (const [id, entry] of Object.entries(parsed)) {
      if (entry && VALID_STATUS.includes(entry.status)) {
        clean[id] = { status: entry.status, savedAt: Number(entry.savedAt) || 0 };
      }
    }
    return clean;
  } catch {
    return {}; // storage blocked or corrupted: start with an empty list
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "toggle": {
      if (state[action.id]) {
        const { [action.id]: _removed, ...rest } = state;
        return rest;
      }
      return { ...state, [action.id]: { status: "todo", savedAt: action.now } };
    }
    case "status":
      return state[action.id]
        ? { ...state, [action.id]: { ...state[action.id], status: action.status } }
        : state;
    case "remove": {
      const { [action.id]: _removed, ...rest } = state;
      return rest;
    }
    case "clear":
      return {};
    default:
      return state;
  }
}

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const [saved, dispatch] = useReducer(reducer, undefined, load);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* ignore: the list still works for this session */
    }
  }, [saved]);

  const toggle = useCallback(
    (resource) => {
      const wasSaved = Boolean(saved[resource.id]);
      dispatch({ type: "toggle", id: resource.id, now: Date.now() });
      setMessage(wasSaved ? `Removed ${resource.title} from your list` : `Saved ${resource.title} to your list`);
    },
    [saved]
  );

  const setStatus = useCallback((id, status) => dispatch({ type: "status", id, status }), []);
  const remove = useCallback(
    (resource) => {
      dispatch({ type: "remove", id: resource.id });
      setMessage(`Removed ${resource.title} from your list`);
    },
    []
  );
  const clear = useCallback(() => {
    dispatch({ type: "clear" });
    setMessage("Your list is now empty");
  }, []);

  const value = useMemo(
    () => ({ saved, toggle, setStatus, remove, clear, message }),
    [saved, toggle, setStatus, remove, clear, message]
  );
  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}

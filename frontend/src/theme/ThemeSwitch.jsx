import { useTheme } from "../theme/ThemeContext";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";
  const isChat = theme === "chat";

  const base =
    "rounded-full px-3 py-1 text-xs font-semibold transition border";

  // ✅ ACTIVE BUTTON STYLE
  let active = "";
  if (isLight) {
    active = "bg-slate-900 text-white border-slate-900";
  } else if (isChat) {
    active = "bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border-transparent";
  } else {
    active = "bg-white/15 text-white border-white/20";
  }

  // ✅ INACTIVE BUTTON STYLE
  let inactive = "";
  if (isLight) {
    inactive =
      "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
  } else if (isChat) {
    inactive =
      "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
  } else {
    inactive =
      "bg-white/5 text-white/70 border-white/10 hover:bg-white/10";
  }

  const btn = (key, label) => (
    <button
      type="button"
      onClick={() => setTheme(key)}
      className={`${base} ${theme === key ? active : inactive}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      {btn("dark", "Dark")}
      {btn("light", "Light")}
      {btn("chat", "Chat")}
    </div>
  );
}

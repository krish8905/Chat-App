import { useTheme } from "../theme/ThemeContext";

export default function AuthInput({ label, icon, right, ...props }) {
  const { theme } = useTheme();

  const base =
    "flex items-center gap-2 rounded-2xl px-4 py-3 transition border outline-none";
  const focus =
    "focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400/50";

  const themeBox =
    theme === "dark"
      ? "border-white/10 bg-white/5"
      : "border-black/10 bg-slate-50";

  const text =
    theme === "dark"
      ? "text-white placeholder:text-white/40"
      : "text-slate-900 placeholder:text-slate-400";

  const iconColor = theme === "dark" ? "text-white/60" : "text-slate-500";

  return (
    <div>
      <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-white/70" : "text-slate-600"}`}>
        {label}
      </label>

      <div className={`${base} ${themeBox} ${focus}`}>
        <span className={iconColor}>{icon}</span>
        <input {...props} className={`w-full bg-transparent outline-none ${text}`} />
        {right}
      </div>
    </div>
  );
}

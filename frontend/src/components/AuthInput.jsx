import { useTheme } from "../theme/ThemeContext";

export default function AuthInput({ label, icon, right, ...props }) {
  const { theme } = useTheme();

  const base = "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 border outline-none group";

  const focus = theme === "dark"
    ? "focus-within:border-indigo-500 focus-within:bg-slate-900/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
    : "focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)]";

  const themeBox = theme === "dark"
    ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
    : "border-slate-200 bg-slate-50 hover:border-slate-300";

  const text = theme === "dark"
    ? "text-white placeholder:text-slate-500"
    : "text-slate-900 placeholder:text-slate-400";

  const iconColor = theme === "dark"
    ? "text-slate-500 group-focus-within:text-indigo-400 transition-colors"
    : "text-slate-400 group-focus-within:text-blue-500 transition-colors";

  return (
    <div>
      <label className={`mb-2 block text-sm font-bold tracking-wide ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
        {label}
      </label>

      <div className={`${base} ${themeBox} ${focus}`}>
        {icon && <span className={`${iconColor} flex items-center justify-center`}>{icon}</span>}
        <input {...props} className={`w-full bg-transparent outline-none font-medium text-base ${text}`} />
        {right}
      </div>
    </div>
  );
}

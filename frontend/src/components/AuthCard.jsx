import ThemeSwitch from "../theme/ThemeSwitch";
import { useTheme } from "../theme/ThemeContext";

export default function AuthCard({ pill, title, subtitle, children, footer }) {
  const { theme } = useTheme();

  const styles = {
    dark: {
      page: "bg-slate-950",
      card: "border-white/10 bg-white/5 text-white backdrop-blur-xl",
      pill: "from-fuchsia-500 to-indigo-500",
      footerText: "text-white/40",
      blobs: true,
    },
    light: {
      page: "bg-gradient-to-br from-slate-50 to-indigo-50",
      card: "border-black/10 bg-white text-slate-900 shadow-xl",
      pill: "from-indigo-600 to-purple-600",
      footerText: "text-slate-500",
      blobs: false,
    },
    chat: {
      page: "bg-gradient-to-br from-emerald-50 to-slate-50",
      card: "border-black/10 bg-white text-slate-900 shadow-xl",
      pill: "from-emerald-600 to-teal-600",
      footerText: "text-slate-500",
      blobs: false,
    },
  }[theme];

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden px-4 ${styles.page}`}>
      {/* optional blobs only for dark */}
      {styles.blobs && (
        <>
          <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="pointer-events-none absolute top-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        </>
      )}

      <div className="w-full max-w-md">
        <div className={`relative rounded-3xl border p-8 overflow-hidden ${styles.card}`}>
          {/* top row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs font-semibold opacity-70">
            </div>
            <ThemeSwitch />
          </div>

          {/* Top gradient pill */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className={`rounded-full bg-gradient-to-r ${styles.pill} px-4 py-1 text-xs font-semibold text-white shadow-lg`}>
              {pill}
            </div>
          </div>

          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm opacity-70">
            {subtitle}
          </p>

          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>

        <p className={`mt-6 text-center text-xs ${styles.footerText}`}>
          Built by Krish 
        </p>
      </div>
    </div>
  );
}

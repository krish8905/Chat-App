import ThemeSwitch from "../theme/ThemeSwitch";
import { useTheme } from "../theme/ThemeContext";

export default function AuthCard({ pill, title, subtitle, children, footer }) {
  const { theme } = useTheme();

  const styles = {
    dark: {
      page: "bg-[#0f172a]",
      card: "border-slate-800 bg-slate-900 shadow-2xl shadow-indigo-500/5 rounded-2xl",
      pill: "from-indigo-600 to-blue-500 text-white shadow-indigo-500/20",
      footerText: "text-slate-500",
      blobs: true,
      blob1: "bg-indigo-600/10",
      blob2: "bg-blue-600/10",
      blob3: "bg-indigo-400/10",
    },
    light: {
      page: "bg-slate-50",
      card: "border-slate-200 bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl",
      pill: "from-indigo-600 to-blue-500 text-white shadow-blue-500/20",
      footerText: "text-slate-400",
      blobs: true,
      blob1: "bg-indigo-200/20",
      blob2: "bg-blue-200/20",
      blob3: "bg-slate-200/30",
    },
    chat: {
      page: "bg-slate-50",
      card: "border-slate-200 bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl",
      pill: "from-indigo-600 to-blue-500 text-white shadow-blue-500/20",
      footerText: "text-slate-400",
      blobs: false,
    },
  }[theme] || {
    page: "bg-slate-900",
    card: "border-slate-800 bg-slate-900 text-white shadow-xl rounded-2xl",
    pill: "from-indigo-600 to-blue-500",
    footerText: "text-slate-500",
    blobs: false
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden px-4 transition-colors duration-500 ${styles?.page}`}>
      {/* Playful animated blobs */}
      {styles?.blobs && (
        <>
          <div className={`pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full blur-[80px] animate-float ${styles.blob1}`} />
          <div className={`pointer-events-none absolute top-40 -right-20 h-72 w-72 rounded-full blur-[80px] animate-float-delayed ${styles.blob2}`} />
          <div className={`pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full blur-[100px] animate-float ${styles.blob3}`} />
        </>
      )}

      <div className="w-full max-w-md relative z-10">
        <div className={`relative border p-6 sm:p-8 transition-all duration-300 ${styles?.card}`}>

          {/* top row */}
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold opacity-70"></div>
            <ThemeSwitch />
          </div>

          {/* Top gradient pill */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 hover:scale-105 transition-transform cursor-default">
            <div className={`rounded-xl bg-gradient-to-r ${styles?.pill} px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase shadow-md transition-all`}>
              {pill}
            </div>
          </div>

          <h2 className={`mt-4 text-center text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {title}
          </h2>
          <p className={`mt-2 text-center text-base font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {subtitle}
          </p>

          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 pt-4 border-t border-slate-200/10">{footer}</div>}
        </div>

        <p className={`mt-6 text-center text-[10px] font-bold tracking-widest uppercase ${styles?.footerText}`}>
          Chatify App
        </p>
      </div>
    </div>
  );
}

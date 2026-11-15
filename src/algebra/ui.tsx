// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
import { useMemo, type ReactNode, type ButtonHTMLAttributes } from "react";
import katex from "katex";
import { cn } from "../utils/cn";

export function TeX({ tex, display = false, className }: { tex: string; display?: boolean; className?: string }) {
  const html = useMemo(() => { try { return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false, trust: false }); } catch { return tex; } }, [tex, display]);
  return display ? <div className={cn("jb-math-display", className)} dangerouslySetInnerHTML={{ __html: html }} /> : <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function RichMath({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => {
    const out: { type: "text" | "inline" | "display"; value: string }[] = [];
    let i = 0, buf = "";
    while (i < text.length) {
      if (text[i] === "$" && text[i + 1] === "$") { if (buf) { out.push({ type: "text", value: buf }); buf = ""; } const end = text.indexOf("$$", i + 2); if (end !== -1) { out.push({ type: "display", value: text.slice(i + 2, end) }); i = end + 2; continue; } }
      else if (text[i] === "$") { if (buf) { out.push({ type: "text", value: buf }); buf = ""; } const end = text.indexOf("$", i + 1); if (end !== -1) { out.push({ type: "inline", value: text.slice(i + 1, end) }); i = end + 1; continue; } }
      buf += text[i++];
    }
    if (buf) out.push({ type: "text", value: buf });
    return out;
  }, [text]);
  return <span className={className}>{parts.map((p, i) => p.type === "text" ? <span key={i}>{p.value}</span> : <TeX key={i} tex={p.value} display={p.type === "display"} />)}</span>;
}

export function Btn({ children, variant = "primary", size = "md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger" | "success" | "gold"; size?: "sm" | "md" | "lg"; children: ReactNode }) {
  return <button className={cn("jb-btn", `jb-btn-${variant}`, `jb-btn-${size}`, className)} {...props}>{children}</button>;
}
export function Badge({ children, color = "lapis", className }: { children: ReactNode; color?: "lapis" | "gold" | "emerald" | "magenta" | "red" | "turquoise" | "slate"; className?: string }) {
  return <span className={cn("jb-badge", `jb-badge-${color}`, className)}>{children}</span>;
}
export function Progress({ value, className, color }: { value: number; className?: string; color?: string }) {
  return <div className={cn("jb-progress", className)}><div style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} /></div>;
}
export function Card({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("jb-card", className)}>{children}</div>; }
export function SectionTitle({ kicker, title, sub, right }: { kicker: string; title: ReactNode; sub?: string; right?: ReactNode }) {
  return <div className="jb-section-title"><div><div className="jb-kicker">{kicker}</div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>{right}</div>;
}
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <label className="jb-toggle"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span className="jb-toggle-track"><span /></span><span>{label}</span></label>;
}
export function Range({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  return <label className="jb-range"><span className="jb-range-head"><span>{label}</span><b>{format ? format(value) : value}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}

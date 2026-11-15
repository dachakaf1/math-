import katex from 'katex';
import 'katex/dist/katex.min.css';
const html = (t: string, display: boolean) => katex.renderToString(t, { displayMode: display, throwOnError: false });
/** Texte avec formules : $...$ en ligne, $$...$$ centré. Les retours à la ligne font des paragraphes. */
export default function Rich({ text }: { text: string }) {
  return (<>{text.split('\n').map((line, k) => (<p key={k} className="rich">{line.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/).map((s, i) =>
    s.startsWith('$$') ? <span key={i} className="blk" dangerouslySetInnerHTML={{ __html: html(s.slice(2, -2), true) }} />
    : s.startsWith('$') && s.length > 1 ? <span key={i} dangerouslySetInnerHTML={{ __html: html(s.slice(1, -1), false) }} /> : s)}</p>))}</>);
}

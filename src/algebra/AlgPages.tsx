import './jabr.css';
import Labs from './pages/Labs';
import Games from './pages/Games';
import { JabrProvider } from './store';
export default function AlgPages({ page }: { page: 'labs' | 'jeux' }) {
  return <JabrProvider><div className="jabr">{page === 'labs' ? <Labs /> : <Games />}</div></JabrProvider>;
}

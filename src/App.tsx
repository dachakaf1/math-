import { Component, type ReactNode } from 'react';
import { useRoute, go } from './core/router';
import Launcher from './launcher/Launcher';
import ModuleShell from './pages/ModuleShell';
import { Particles } from './core/ui';

class ErrorBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (<div className="wrap"><div className="empty" role="alert"><h2>Cette page a rencontré un problème</h2>
      <p>Tes données sont intactes. Retourne à l’accueil et réessaie.</p>
      <button className="btn" onClick={() => { this.setState({ err: false }); go(''); }}>Retour à l’accueil</button></div></div>);
  }
}
export default function App() {
  const route = useRoute();
  return (<><Particles /><ErrorBoundary key={route.kind === 'home' ? 'home' : route.module + (route.tab ?? '')}>
    {route.kind === 'home' ? <Launcher /> : <ModuleShell module={route.module} tab={route.tab} rest={route.rest} />}
  </ErrorBoundary></>);
}

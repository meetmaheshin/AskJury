import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pushSupported, pushStatus, enablePush, disablePush } from '../utils/push';

/**
 * "Get the app" controls: install-to-home-screen prompt + notification toggle.
 * Renders nothing for features the device doesn't support.
 */
export default function PwaControls() {
  const { isAuthenticated } = useAuth();
  const [installEvt, setInstallEvt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [notif, setNotif] = useState('off'); // unsupported | denied | on | off | busy
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e); };
    const onInstalled = () => { setInstalled(true); setInstallEvt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => { pushStatus().then(setNotif); }, [isAuthenticated]);

  const install = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    await installEvt.userChoice;
    setInstallEvt(null);
  };

  const toggleNotif = async () => {
    setMsg('');
    if (!isAuthenticated) { setMsg('Sign in to enable notifications.'); return; }
    setNotif('busy');
    try {
      if ((await pushStatus()) === 'on') {
        await disablePush();
        setNotif('off');
      } else {
        await enablePush();
        setNotif('on');
      }
    } catch (e) {
      setMsg(e.message || 'Could not change notifications.');
      setNotif(await pushStatus());
    }
  };

  const showInstall = installEvt && !installed;
  const showNotif = notif !== 'unsupported';
  if (!showInstall && !showNotif) return null;

  return (
    <div>
      <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-3">Get the App</h4>
      <div className="flex flex-col gap-2">
        {showInstall && (
          <button
            onClick={install}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            📲 Install AskJury
          </button>
        )}
        {installed && (
          <span className="text-xs text-success">✓ Installed as an app</span>
        )}
        {showNotif && (
          <button
            onClick={toggleNotif}
            disabled={notif === 'busy' || notif === 'denied'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-200 text-sm font-semibold rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {notif === 'on' ? '🔔 Notifications on' : notif === 'busy' ? '…' : notif === 'denied' ? '🔕 Notifications blocked' : '🔔 Enable notifications'}
          </button>
        )}
        {msg && <span className="text-xs text-gray-400">{msg}</span>}
      </div>
    </div>
  );
}

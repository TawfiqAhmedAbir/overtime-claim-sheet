import { useCallback, useEffect, useState } from 'react';
import { isAndroid, isInstalledApp } from '../lib/platform';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installedFlag = typeof window !== 'undefined' && isInstalledApp();
const subscribers = new Set<() => void>();

function publishInstallState(): void {
  subscribers.forEach((listener) => listener());
}

if (typeof window !== 'undefined' && isAndroid()) {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    publishInstallState();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installedFlag = true;
    publishInstallState();
  });
}

export function useAndroidInstall() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    deferredPrompt,
  );
  const [installed, setInstalled] = useState(installedFlag);

  useEffect(() => {
    const sync = () => {
      setPromptEvent(deferredPrompt);
      setInstalled(installedFlag);
    };
    subscribers.add(sync);
    sync();
    return () => {
      subscribers.delete(sync);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const event = deferredPrompt;
    if (!event) return;
    deferredPrompt = null;
    publishInstallState();
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === 'accepted') {
        installedFlag = true;
        publishInstallState();
      }
    } catch {
      deferredPrompt = null;
      publishInstallState();
    }
  }, []);

  return {
    showGuidance: isAndroid() && !installed && promptEvent !== null,
    promptInstall,
  };
}

// Offline notification system

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }
  return Notification.requestPermission();
}

export function showNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  });
}

export function scheduleNotification(title: string, body: string, delay: number): void {
  setTimeout(() => {
    showNotification(title, { body });
  }, delay);
}

// Setup service worker for background notifications
export function setupBackgroundSync(): void {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration: any) => {
      return registration.sync.register('sync-data');
    }).catch(err => console.error('Background sync registration failed:', err));
  }
}

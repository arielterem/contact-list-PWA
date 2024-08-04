import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Application bootstrap failed:', err));

// Add console log to check if in development mode
if (isDevMode()) {
} else {
  // Provide service worker configuration
  const serviceWorkerProviders = provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  });

  // Log service worker status
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
    }).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  }
}

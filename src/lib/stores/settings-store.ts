import { get, writable } from 'svelte/store';
import { LOCAL_STORAGE_SETTINGS_KEY } from '../util/constants';

export class ApplicationSettings {
  hideStudentNames: boolean = false;
}

export const applicationSettings = writable<ApplicationSettings>(
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}')
);

export const saveSettings = () => {
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(get(applicationSettings)));
};

export const loadSettings = () => {
  applicationSettings.set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY)));
};

export const updateSettings = <K extends keyof ApplicationSettings>(key: K, value: any) => {
  applicationSettings.update((s) => ({ ...s, [key]: value }));
  saveSettings();
};

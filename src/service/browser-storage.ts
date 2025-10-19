import { RootState, StoreKey, StoreKeys } from '../store/root';

export interface BrowserStorageServiceInterface {
  getRootState(): Promise<Partial<RootState>>;
  saveState<K extends StoreKey>(key: K, state: RootState[K]): Promise<void>;
  has(key: StoreKey): Promise<boolean>;
}

type StorageArea = typeof browser.storage.local | typeof chrome.storage.local;

class BrowserStorageAreaStorageService implements BrowserStorageServiceInterface {
  public constructor(protected storageArea: StorageArea) {}

  public async getRootState(): Promise<Partial<RootState>> {
    const storage = await this.storageArea.get(StoreKeys);
    const state: Partial<RootState> = {};
    for (const key of StoreKeys) {
      const storedState: string | undefined = storage[key];
      if (storedState) {
        state[key] = JSON.parse(storedState);
      }
    }
    return state;
  }

  public async saveState<K extends StoreKey>(key: K, state: RootState[K]): Promise<void> {
    await this.storageArea.set({ [key]: JSON.stringify(state) });
  }

  public async has(key: StoreKey): Promise<boolean> {
    const storage = await this.storageArea.get(key);
    return !!storage;
  }
}

export class FirefoxSyncStorageService extends BrowserStorageAreaStorageService {
  public constructor() {
    super(browser.storage.sync);
  }
}

export class ChromeSyncStorageService extends BrowserStorageAreaStorageService {
  public constructor() {
    super(chrome.storage.sync);
  }
}

class LocalStorageService implements BrowserStorageServiceInterface {
  public async getRootState(): Promise<Partial<RootState>> {
    const state: Partial<RootState> = {};
    for (const key of StoreKeys) {
      const storedState: string | null = localStorage.getItem(key);
      if (storedState) {
        state[key] = JSON.parse(storedState);
      }
    }
    return state;
  }

  public async saveState<K extends StoreKey>(name: K, state: RootState[K]): Promise<void> {
    localStorage.setItem(name, JSON.stringify(state));
  }

  public async has(key: StoreKey): Promise<boolean> {
    return !!localStorage.getItem(key);
  }
}

export function CreateBrowserStorageService(): BrowserStorageServiceInterface {
  if (typeof browser !== 'undefined' && browser?.storage?.sync) {
    console.log('Running in Firefox');
    return new FirefoxSyncStorageService();
  }
  if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
    console.log('Running in Chrome');
    return new ChromeSyncStorageService();
  }
  if (localStorage) {
    console.log('Running in a web page');
    return new LocalStorageService();
  }
  throw new Error('No browser storage is available');
}

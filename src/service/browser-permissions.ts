type PermissionsApi = typeof browser.permissions | typeof chrome.permissions;

type AnyPermissions = browser.permissions.AnyPermissions;
type Permissions = browser.permissions.Permissions;

export interface BrowserPermissionsServiceInterface {
  getAll(): Promise<AnyPermissions>;
  request(permissions: Permissions): Promise<boolean>;
}

class BrowserPermissionsService implements BrowserPermissionsServiceInterface {
  public constructor(protected permissionsApi: PermissionsApi) {}

  public async getAll(): Promise<AnyPermissions> {
    return this.permissionsApi.getAll();
  }

  public async request(permissions: Permissions): Promise<boolean> {
    return this.permissionsApi.request(permissions);
  }
}

export class FirefoxPermissionsService extends BrowserPermissionsService {
  public constructor() {
    super(browser.permissions);
  }
}

export class ChromePermissionsService extends BrowserPermissionsService {
  public constructor() {
    super(chrome.permissions);
  }
}

export function CreateBrowserPermissionsService(): BrowserPermissionsServiceInterface | null {
  if (typeof browser !== 'undefined' && browser?.storage?.sync) {
    return new FirefoxPermissionsService();
  }
  if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
    return new ChromePermissionsService();
  }
  return null;
}

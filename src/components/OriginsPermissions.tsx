import React, { ReactNode, useEffect, useId, useState } from 'react';

import { ReactHooks } from '../hooks';
import { Status } from '../types/status';
import { AppError, CreateAppError } from '../util/error';
import './OriginsPermissions.scss';
import ShowAppError from './ShowAppError';

interface OriginsPermissionsState {
  status: Status;
  missingOrigins?: string[];
  error?: AppError;
}

interface OriginsPermissionsProps {
  origins: string[];
  message: string;
  children?: ReactNode;
}

type OriginsPermissionsHooks = ReactHooks<OriginsPermissionsState, 'setState'>;

function usePermissionService() {
  if (typeof browser !== 'undefined' && browser?.permissions) {
    return browser.permissions;
  }
  if (chrome?.permissions) {
    return chrome.permissions;
  }
  return undefined;
}

function missingOrigins(has: string[], needs: string[]): string[] {
  return needs.filter(origin => !has.includes(origin));
}

async function getMissingOrigins(needs: string[]): Promise<string[]> {
  const permissionsService = usePermissionService()!;
  const permissions = await permissionsService.getAll();
  return missingOrigins(permissions.origins ?? [], needs);
}

function requestMissingOrigins({ state, setState }: OriginsPermissionsHooks) {
  const permissionsService = usePermissionService()!;
  permissionsService
    .request({ origins: state.missingOrigins })
    .then(accepted => {
      if (accepted) {
        setState({ ...state, status: 'fulfilled', missingOrigins: [] });
      }
    })
    .catch(error => setState({ ...state, status: 'rejected', error: CreateAppError(error) }));
}

function OriginsPermissions({ origins, message, children }: OriginsPermissionsProps) {
  const id = useId();
  const [state, setState] = useState<OriginsPermissionsState>({
    status: 'idle',
  });

  const hooks: OriginsPermissionsHooks = { state, setState };

  if (!usePermissionService()) {
    return children as JSX.Element;
  }

  useEffect(() => {
    getMissingOrigins(origins)
      .then(missingOrigins => setState({ ...state, missingOrigins }))
      .catch(error => setState({ ...state, status: 'rejected', error: CreateAppError(error) }));
  }, []);

  if (state.status === 'rejected') {
    return <ShowAppError error={state.error!} />;
  }

  if (state.status !== 'fulfilled' && state.missingOrigins?.length !== 0) {
    return (
      <div className="missing-origins">
        <button id={id} type="button" onClick={() => requestMissingOrigins(hooks)}>
          {message}
        </button>
      </div>
    );
  }

  return children as JSX.Element;
}

OriginsPermissions.defaultProps = {
  children: undefined,
};

export default OriginsPermissions;

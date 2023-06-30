type NotArray = (object | string | bigint | number | boolean | symbol) & { length?: never };
type NonArrayObject = object & NotArray;

/**
 * Fields that should be explicitly deleted from storage state.
 *
 * This field is useful when a field in some Redux state is removed from one release to another.
 * It explicitly deletes the field if it is seen in storage so that it does not linger in storage forever.
 */
export const Deleted = Symbol('Deleted');

/**
 * List of deleted fields.
 *
 * Represented as its own class to detect it when applying defaults for object types.
 */
class DeletedFieldsList {
  public constructor(public fields: string[]) {}
}

/**
 * Creates a list of fields to delete from state on initialization.
 * @param fields Fields to delete when found on state.
 * @returns `DeletedFieldsList`
 */
export function DeletedFields(...fields: string[]): DeletedFieldsList {
  return new DeletedFieldsList(fields);
}

type RequiredKeys<T> = { [key in keyof T]-?: undefined extends T[key] ? never : key }[keyof T];
type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;

/**
 * Type for specifying the default state of a piece of Redux state.
 *
 * Required keys must be specified.
 * Optional keys may or may not be specified. Objects are allowed to only specify deleted keys.
 * The `Deleted` symbol can be assigned the return value of a `DeletedFields` call to specify fields that should be
 * deleted when detected on initializing state.
 */
export type DefaultState<T> = {
  [key in RequiredKeys<T>]-?: T[key] extends NonArrayObject ? DefaultState<T[key]> : T[key];
} & {
  [key in OptionalKeys<T>]?:
    | (T[key] extends NonArrayObject ? DefaultState<T[key]> : T[key])
    | DeletedFieldsList
    | undefined;
} & {
  [Deleted]?: DeletedFieldsList;
};

function deleteFields(state: any, fields: string[]) {
  for (const key of fields) {
    if (key in state) {
      delete (state as any)[key];
    }
  }
}

/**
 * Applies the default state to the given state object based on the given specification.
 * @param state State.
 * @param defaults Default specification.
 * @returns Updated state, which is the same as `state`.
 */
export function applyDefaults<T extends object>(state: T, defaults: DefaultState<T>): T {
  if (!state) {
    state = {} as T;
  }
  for (const [key, value] of Object.entries(defaults) as [keyof T, T[keyof T]][]) {
    if (value === undefined || value === null) {
      continue;
    }

    // Default value is an object of default values.
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (value instanceof DeletedFieldsList && state[key]) {
        deleteFields(state[key], value.fields);
      }
      (state[key] as object) = applyDefaults(state[key] as object, value as DefaultState<T[keyof T]>);
    }

    // Apply default value if state has no value for this key.
    if (state[key] === undefined || state[key] === null) {
      state[key] = value;
    }
  }

  // Explicitly delete keys marked as deleted.
  //
  // This prevents excess state from persisting in storage forever.
  const deletedKeys = defaults[Deleted];
  if (deletedKeys) {
    deleteFields(state, deletedKeys.fields);
  }

  return state;
}

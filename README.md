# Christ-Centered 2.0

**Christ-Centered** is a Google Chrome extension to override your new tab page with a Bible Verse of the Day.

## History

Christ-Centered was my first programming project ever in university. It was originally written in React, and [its codebase](https://github.com/jackson-nestelroad/christ-centered) reflects my early days as a programmer.

Over the years, I became interested in adding more features to the simple extension, such as supporting different Bible versions and languages and porting the extension to Firefox. These features were difficult to add to the original codebase.

Thus, five years after the first version, I have decided to rewrite the extension completely, making it much more adpatable to new features and use cases!

## About

**Christ-Centered** is built with React, TypeScript, and SCSS.

## Features

- Display the Bible Verse of the Day (from BibleGateway) in your new tab page.
- Display current weather information for your area or for a custom location.
- Display a custom Bible verse or entire passage via passage lookup.
- Dynamic width and height resizing.

## Engineering Documentation

Bible verses are fetched from BibleGateway using [daily-bread](https://github.com/jackson-nestelroad/daily-bread), a generic TypeScript module built for Bible verse and passage lookup.

### Directory Layout

- `build/` - Output directory.
- `dev/` - Development scripts.
- `eslint/` - ESLint configuration.
- `images/` - Images used for promotion.
- `public/` - Static assets served with the app.
- `src/` - Source directory.
  - `common/` - Generic, reusable React components.
  - `components/` - Application-specific React components.
  - `context/` - React context providers.
  - `data/` - Data built within the application itself.
  - `hooks/` - Utilities for working with React hooks.
  - `lib/` - Library functionality that works independent of the React application.
  - `service/` - TypeScript modules that provide a specific service and can be shared across components.
  - `store/` - Redux store configuration.
  - `types/` - TypeScript types.
  - `util/` - General utility funtions.
  - `views/` - Application views.
  - `index.tsx` - Application entrypoint.
  - `theme.scss` - Variables and mixins for consistent styling.

## Persistent Data Storage

A large part of this application deals with application data storage. Since this application runs exclusively in a browser, persistent data is not stored in an external database but in the browser itself.

All application data must be checkpointed to the browser storage system for **consistency** (settings should not change from one load to the next) and for **caching** (the verse of the day changes once per day, so no need to fetch it every time the application loads).

This application uses **Redux** to manage application-wide state. However, Redux state is lost on every reload of the application. Thus, additional mechanisms were built to correctly sync the Redux store with the browser's local storage (which is persistent across application reloads).

- `<BrowserStorageProvider>` provides a `BrowserStorageServiceInterface`, which gives a generic interface for saving state to the browser's local storage. In Chrome extensions, this uses the `chrome.sync` API. In a webpage, this uses `localStorage`.
- `<StoreLoader>` automatically loads the store in browser storage to the Redux store. In this process, default values are filled in to missing values, and values explicitly marked for deletion by the application are removed. This conforms whatever state was stored in browser storage to the form expected by the application.
- Finally, the `saveToBrowserStorage` Redux middleware syncs all Redux store changes to the browser storage. Thus, the application state updates will persist when the application reloads.

All of this data synchronization happens behind the scenes of the application logic. Thus, individual components only need to work with the Redux store (as any other React application would) and not worry about saving the data to the browser's local storage.

## Separation of Concerns

The application employs strict separation of concerns using multiple concepts:

- **Components** - React components that render HTML using application state.
- **Service** - TypeScript modules that provide some feature.
- **Context** - React components that share state across the entire application. In this application, contexts are used to provide a singleton instance of a Service.

Take fetching the weather, for example. `<Weather>` is a React component for rendering weather data HTML. It is creates inside of a `WeatherProvider`, which is a context that provides an instance of the `WeatherServiceInterface`. Thus, the rendering logic of `<Weather>` only needs to call the `useWeather()` hook to get an instance of the `WeatherServiceInterface` and call a method on that.

These concepts allow rendering logic and application logic to be completely separated from one another in the application.

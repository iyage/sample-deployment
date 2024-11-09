## Persisting Recent Searches

The recent searches functionality in the Tracking component/feature of this project is powered by `redux-persist`, which allows us to persist the user's search history even when the page is reloaded or the browser is closed.

### How it Works

`redux-persist` integrates with Redux to store and retrieve data from local storage or other storage engines. In this project, we use `redux-persist` to persist the recent searches data.

### Implementation Details

- The recent searches data is stored in the Redux store using the `redux-persist` integration.
- The persist configuration is defined in the `persistConfig.js` file.
- The recent searches reducer is included in the `whitelist` array of the persist configuration, ensuring its data is persisted.
- The persisted state is rehydrated on app launch, restoring the user's previous recent searches.
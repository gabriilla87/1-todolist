import App from "../app/App";
import { ReduxStoreProviderDecorator } from "./decorators/ReduxStoreProviderDecorator";

export default {
  title: "App Stories",
  decorators: [ReduxStoreProviderDecorator],
};

export const AppWithReduxBaseExample = () => {
  return <App />;
};

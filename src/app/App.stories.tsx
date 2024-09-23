import App from "./App";
import {ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator";

export default {
    title: "App Stories",
    decorators: [ReduxStoreProviderDecorator]
}

export const AppWithReduxBaseExample = () => {
    return <App/>
}
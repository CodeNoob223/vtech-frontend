import ReactDOM from 'react-dom/client';
import './styles/main.css';
import './styles/icons.css';
import App from "./App";
import store from './app/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);


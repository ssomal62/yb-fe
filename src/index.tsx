import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, useLocation} from "react-router-dom";
import {NextUIProvider} from "@nextui-org/react";

const ScrollToTop = () => {
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <NextUIProvider>
        <React.StrictMode>
            <BrowserRouter>
                <ScrollToTop/>
                <App/>
            </BrowserRouter>
        </React.StrictMode>
    </NextUIProvider>
);



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { UserContextProvider } from './userContext';
import { ThemeContextProvider } from './ThemeContext';
import { FileContextProvider } from './FileContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <UserContextProvider>
      <ThemeContextProvider>
        <FileContextProvider>
          <BrowserRouter>
            <LiveblocksProvider publicApiKey={"pk_dev_2rQ_sf_wK2K5sLImvR6lkQyLrAh6bmpZMaayf6KIw1uHYmueOpeBhHcBiWayEZ8E"}>        
                <App />
            </LiveblocksProvider>
          </BrowserRouter>
        </FileContextProvider>
      </ThemeContextProvider>
    </UserContextProvider>
  </StrictMode>
);
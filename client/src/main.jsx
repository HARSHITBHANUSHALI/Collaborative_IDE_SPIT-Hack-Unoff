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

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <UserContextProvider>
      <BrowserRouter>
        <LiveblocksProvider publicApiKey={"pk_dev_2rQ_sf_wK2K5sLImvR6lkQyLrAh6bmpZMaayf6KIw1uHYmueOpeBhHcBiWayEZ8E"}>
          <RoomProvider id="my-room">
            <App />
          </RoomProvider>
        </LiveblocksProvider>
      </BrowserRouter>
    </UserContextProvider>
  </StrictMode>
);
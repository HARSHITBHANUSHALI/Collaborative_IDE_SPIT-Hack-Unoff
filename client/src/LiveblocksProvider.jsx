import { createClient } from "@liveblocks/client";
import { LiveblocksProvider } from "@liveblocks/react";
import React from "react";

const client = createClient({
    // Point to your auth endpoint
    publicApiKey: "pk_dev_2rQ_sf_wK2K5sLImvR6lkQyLrAh6bmpZMaayf6KIw1uHYmueOpeBhHcBiWayEZ8E",
});

export function Provider({ children }) {
  return <LiveblocksProvider client={client}>{children}</LiveblocksProvider>;
}
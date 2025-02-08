// import { createClient } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_dev_2rQ_sf_wK2K5sLImvR6lkQyLrAh6bmpZMaayf6KIw1uHYmueOpeBhHcBiWayEZ8E",
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
} = createRoomContext(client);
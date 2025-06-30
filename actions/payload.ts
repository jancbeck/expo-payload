import "server-only";

import { getPayload as getPayloadPromise } from "payload";
import config from "@payload-config";

let cachedPayload: Awaited<ReturnType<typeof getPayloadPromise>> | null = null;

const getPayload = async () => {
  if (!cachedPayload) {
    cachedPayload = await getPayloadPromise({ config });
  }
  return cachedPayload;
};

export { getPayload };

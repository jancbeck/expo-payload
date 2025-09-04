import { getPayload as getPayloadPromise } from 'payload';
import config from '@payload-config';

let cachedPayload: Awaited<ReturnType<typeof getPayloadPromise>> | null = null;

const getPayload = async () => {
  // currently required to make payload work with server functions
  (global as any).__METRO_GLOBAL_PREFIX__ = 'expo-payload';

  if (!cachedPayload) {
    cachedPayload = await getPayloadPromise({ config });
  }
  return cachedPayload;
};

export { getPayload };

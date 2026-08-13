import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const KV_MEDIA_KEY = "lalinea:media_config";

export async function getMedia() {
  try {
    const data = await redis.get(KV_MEDIA_KEY);
    if (!data) return {};
    return data;
  } catch (error) {
    console.error("Error leyendo Redis:", error);
    return {};
  }
}

export async function setMedia(newData: any) {
  try {
    await redis.set(KV_MEDIA_KEY, newData);
  } catch (error) {
    console.error("Error escribiendo Redis:", error);
  }
}
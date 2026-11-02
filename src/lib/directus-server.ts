import { createDirectus, rest, authentication, createItem, updateItem } from "@directus/sdk";

const client = createDirectus(process.env.DIRECTUS_URL!)
  .with(rest())
  .with(authentication("json"));

let loggedIn = false;

export async function directus() {
  if (!loggedIn) {
    await client.login(
      process.env.DIRECTUS_ADMIN_EMAIL!,
      process.env.DIRECTUS_ADMIN_PASSWORD!
    );
    loggedIn = true;
  }
  return client;
}

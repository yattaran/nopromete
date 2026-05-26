export type InstagramPublishResult = {
  creationId: string;
  mediaId: string;
};

function requireEnv(name: string) {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`${name} is not configured`);
  return v;
}

function graphUrl(path: string) {
  return `https://graph.facebook.com/v23.0${path.startsWith("/") ? path : `/${path}`}`;
}

async function graphPost<T>(path: string, body: Record<string, string>) {
  const res = await fetch(graphUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const json = (await res.json()) as any;
  if (!res.ok) {
    const message = json?.error?.message ?? `Instagram API error (${res.status})`;
    throw new Error(message);
  }
  return json as T;
}

export async function publishInstagramStoryImage(input: {
  imageUrl: string;
  caption: string;
}) : Promise<InstagramPublishResult> {
  const accessToken = requireEnv("IG_ACCESS_TOKEN");
  const igUserId = requireEnv("IG_USER_ID");

  // 1) Create media container
  const container = await graphPost<{ id: string }>(`/${igUserId}/media`, {
    access_token: accessToken,
    media_type: "STORIES",
    image_url: input.imageUrl,
    caption: input.caption,
  });

  // 2) Publish media container
  const publish = await graphPost<{ id: string }>(`/${igUserId}/media_publish`, {
    access_token: accessToken,
    creation_id: container.id,
  });

  return { creationId: container.id, mediaId: publish.id };
}


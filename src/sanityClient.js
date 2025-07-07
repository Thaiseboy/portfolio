import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: import.meta.env.VITE_SANITY_USE_CDN === 'true',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  token: import.meta.env.SANITY_ACCESS_TOKEN,
});

export default sanityClient;

import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.VUE_APP_SANITY_PROJECT_ID,
  dataset: process.env.VUE_APP_SANITY_DATASET,
  useCdn: process.env.VUE_APP_SANITY_USE_CDN === 'true',
  apiVersion: process.env.VUE_APP_SANITY_API_VERSION,
  token: process.env.VUE_APP_SANITY_ACCESS_TOKEN || undefined,
});

export default sanityClient;

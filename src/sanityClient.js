import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION;

const missing = Object.entries({
  VITE_SANITY_PROJECT_ID: projectId,
  VITE_SANITY_DATASET: dataset,
  VITE_SANITY_API_VERSION: apiVersion,
})
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing Sanity environment variables: ${missing.join(", ")}. ` +
      `Set them in .env locally and in the Netlify project configuration.`,
  );
}

const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: import.meta.env.VITE_SANITY_USE_CDN === "true",
  apiVersion,
});

export default sanityClient;

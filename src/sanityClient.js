import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "w696z6zz",
  dataset: "portfolio-thaiseboy",
  useCdn: true,
  apiVersion: "2023-01-01", // Voeg hier een API-versie toe
});

export default sanityClient;

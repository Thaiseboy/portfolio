import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "w696z6zz",
  dataset: "portfolio-thaiseboy",
  useCdn: true,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_ACCESS_TOKEN,
});

export default sanityClient;

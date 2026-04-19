import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "../src/sanity/schemas";

export default defineConfig({
  name: "anika-labs",
  title: "Anika Labs",
  projectId: "myj2exhy",
  dataset: "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});

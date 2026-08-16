import type { CodegenConfig } from "@graphql-codegen/cli";

import { typeDefs } from "./src/server/graphql/schema";

const config: CodegenConfig = {
  schema: typeDefs,
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "src/graphql/generated/": {
      preset: "client",
    },
  },
  ignoreNoDocuments: false,
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;

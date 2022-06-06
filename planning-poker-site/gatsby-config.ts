import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "Planning Poker Site",
    siteUrl: "https://www.planningpokeronline.com"
  },
  plugins: [
    {
      resolve: "gatsby-plugin-sass",
      options: {
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
            exportLocalsConvention: "camelCase"
          },
        },
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-image"
  ]
};

export default config;

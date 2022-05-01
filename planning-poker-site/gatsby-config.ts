import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Planning Poker Site`,
    siteUrl: `https://www.planningpokeronline.com`
  },
  plugins: ["gatsby-plugin-sass", "gatsby-plugin-react-helmet"]
};

export default config;

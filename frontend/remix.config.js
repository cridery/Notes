/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_tailwind: true,
  },
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "axios"
  ],
};

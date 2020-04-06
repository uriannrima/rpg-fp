module.exports = {
  require: ["ts-node/register"],
  diff: "true",
  package: "./package.json",
  extension: ["js", "ts"],
  ui: "bdd",
  "watch-files": ["**/*.ts", "**/*.spec.ts"],
};

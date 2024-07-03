module.exports = function (api) {
  const presets = ["babel-preset-expo"];
  const plugins = [
    // your other plugins
    ["@babel/plugin-transform-class-properties", { loose: true }],
    ["@babel/plugin-transform-private-methods", { loose: true }],
    ["@babel/plugin-transform-private-property-in-object", { loose: true }],
  ];

  api.cache(true);

  return {
    presets,
    plugins,
  };
};

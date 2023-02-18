const appConfig = {
  BASE_URL: "kokotko",
};

module.exports = (options) => ({
  externals: {
    appConfig: JSON.stringify(require(path.resolve("app/config/appConfig.js"))), //eslint-disable-line
  },
});

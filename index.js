const { platform, router } = require("bottender/router");
const telegramActions = require("./src/bottender/telegramActions");

module.exports = async function App(context) {
  return router([platform("telegram", telegramActions.telegramActions)]);
};

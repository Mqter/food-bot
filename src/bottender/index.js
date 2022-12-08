const { platform, router } = require("bottender/router");
const telegramActions = require("./telegramActions");

module.exports = async function App(context) {
  return router([platform("telegram", telegramActions.telegramActions)]);
};

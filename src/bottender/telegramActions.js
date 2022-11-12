const { router, text } = require("bottender/router");
const tools = require("./utils");

const telegramActions = async function (context) {
  return router([
    text("*", tools.showKeyboard),
    // telegram.callbackQuery(tools.answerKeyboard),
  ]);
};
module.exports.telegramActions = telegramActions;

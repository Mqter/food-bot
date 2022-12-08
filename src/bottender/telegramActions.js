const { router, text, telegram } = require("bottender/router");
const tools = require("./utils");

const telegramActions = async function (context) {
  return router([
    text("show", tools.showKeyboard),
    text("*", tools.ordering),
    telegram.callbackQuery(tools.answerKeyboard),
  ]);
};
module.exports.telegramActions = telegramActions;

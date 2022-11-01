const { router, text } = require("bottender/router");
const tools = require("./utils");
const dbConnect = require("../db_connection");

const telegramActions = async function (context) {
  dbConnect.query("select * from stud761.user", function (err, result) {
    if (err) throw err;
    console.log(result[0].email);
  });
  return router([
    text("*", tools.showKeyboard),
    // telegram.callbackQuery(tools.answerKeyboard),
  ]);
};
module.exports.telegramActions = telegramActions;

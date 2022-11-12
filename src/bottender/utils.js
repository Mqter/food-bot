const dbConnect = require("../db_connection");

const showKeyboard = async function (context) {
  await context.sendText("Hello World");
  await test(context);
};

async function test(context){
  const users = await getUsers();
  const telegramUser = context.event.rawEvent.message.from;
  const isUserExists = users.filter(
      (value) => value.telegram_uid === telegramUser.id.toString()
  );
  if (isUserExists.length > 0) {
    await context.sendText("Hello World");
  } else {
    await context.sendText("Not auth");
  }
}

async function getUsers() {
  const query = "SELECT * FROM stud761.user";
  const results = await dbConnect.promise().query(query);
  return results[0];
}

module.exports.showKeyboard = showKeyboard;

const dbConnect = require("../db_connection");
const mqttClient = require("../mqtt");
const keyboard = require("./telegramKeyboard");
const mysql = require("mysql2");
const { TypesEnum } = require("./enum");

// const showKeyboard2 = async function (context) {
//   await context.sendText("Hello World");
//   await mqttClient.publish("presence", "Hello mqtt");
//   await test(context);
// };

// async function test(context) {
//   const users = await sqlRequest();
//   const telegramUser = context.event.rawEvent.message.from;
//   const isUserExists = users.filter(
//     (value) => value.telegram_uid === telegramUser.id.toString()
//   );
//   if (isUserExists.length > 0) {
//     await context.sendText("Hello World");
//   } else {
//     await context.sendText("Not auth");
//   }
// }

const showKeyboard = async function (context) {
  const mainMenuMap = new Map();
  const categories = await sqlRequest("SELECT * FROM stud761.product_category");
  categories.forEach((value) => {
    mainMenuMap.set(TypesEnum.MENU_1 + value.id, value.name);
  });
  const mainMenu = keyboard.menuBuilder(mainMenuMap);
  await context.setState({
    event: TypesEnum.MENU_1,
  });
  await context.sendText(mainMenu.text, { replyMarkup: mainMenu.replyMarkup });
};

const answerKeyboard = async function (context) {
  const callbackData = context.event.callbackQuery.data;
  const previousEvent = context.state.event;

  if (callbackData === "end") {
    await endEvent(context);
  } else if (callbackData === "add") {
    await addEvent(context);
  } else if (callbackData.includes(TypesEnum.MENU_1)) {
    await menu_1(context, callbackData);
  } else if (callbackData.includes(TypesEnum.MENU_2)) {
    await menu_2(context, callbackData);
  }
};

const ordering = async function (context) {
  const previousEvent = context.state.event;

  if (previousEvent === TypesEnum.ORDERING) {
    await endEvent_2(context);
  } else if (previousEvent === TypesEnum.ORDERING_END) {
    await endEvent_3(context);
  }
};

async function endEvent(context) {
  await context.sendText(TypesEnum.ORDERING_MESS_1);
  await context.setState({
    event: TypesEnum.ORDERING,
  });
}

async function endEvent_2(context) {
  await context.setState({
    order_2: context.event.message.text,
  });
  await context.sendText(TypesEnum.ORDERING_MESS_2);
  await context.setState({
    event: TypesEnum.ORDERING_END,
  });
}

async function endEvent_3(context) {
  const telegramUser = context.event.rawEvent.message.from;
  const user = await sqlRequest(
    "SELECT * FROM stud761.user WHERE telegram_uid =" +
      mysql.escape(telegramUser.id)
  );
  const order = {
    order: JSON.stringify(context.state.order),
    user: {
      first_name: telegramUser.firstName,
      last_name: telegramUser.lastName,
      phone: null,
      telegram_uid: telegramUser.id
    }
  }
  if (!user[0]) {
    const user = await sqlRequest(
      `INSERT INTO stud761.user (first_name, last_name, phone, telegram_uid) VALUES ("${
        telegramUser.firstName
      }", "${telegramUser.lastName}", "${null}", "${telegramUser.id}")`
    );
    user.affectedRows === 1 ? await mqttClient.publish("food_bot", Buffer.from(JSON.stringify(order))) : undefined;
  } else {
    await mqttClient.publish("food_bot", Buffer.from(JSON.stringify(order)));
  }
  context.resetState();
  await context.sendText(TypesEnum.ORDERING_MESS_3);
}

async function addEvent(context) {
  const state = context.state;
  const order = state.order ? state.order : [];
  order.push({
    category_id: state.category_id,
    product_id: state.product_id,
    product_name: state.product_name,
  });
  await context.setState({
    order: order,
  });
  await context.sendText("Добавлено");
  let orderMes = "";
  order.forEach((value) => {
    orderMes += value.product_name + "\n";
  });

  const subMenuMap = new Map();
  subMenuMap.set("end", "Оформить заказ");
  const subMenu = keyboard.menuBuilder(subMenuMap);
  await context.sendText(`Текущий заказ:\n${orderMes}`, {
    replyMarkup: subMenu.replyMarkup,
  });
}

async function menu_1(context, callbackData) {
  const subMenuMap = new Map();
  const products = await sqlRequest(
    "SELECT * FROM stud761.product WHERE category_id =" +
      mysql.escape(callbackData.split(TypesEnum.MENU_1)[1])
  );
  products.forEach((value) => {
    subMenuMap.set(TypesEnum.MENU_2 + value.id, value.name);
  });
  const subMenu = keyboard.menuBuilder(subMenuMap);
  await context.sendText(subMenu.text, { replyMarkup: subMenu.replyMarkup });
  await context.setState({
    event: TypesEnum.MENU_2,
  });
}

async function menu_2(context, callbackData) {
  const subMenuMap = new Map();
  const products = await sqlRequest(
    "SELECT * FROM stud761.product WHERE id =" +
      mysql.escape(callbackData.split(TypesEnum.MENU_2)[1])
  );

  /*TODO Придумать что-то с отправкой картинок*/
  // await context.sendPhoto(
  //   "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
  // );

  const description = `description: ${products[0].description}\nprice: ${products[0].price}\ndiscount: ${products[0].discount}`;
  subMenuMap.set("add", "Добавить");
  subMenuMap.set("back", "Назад");
  subMenuMap.set("end", "Оформить заказ");
  const subMenu = keyboard.menuBuilder(subMenuMap);
  await context.sendText(description, { replyMarkup: subMenu.replyMarkup });
  await context.setState({
    event: TypesEnum.MENU_3,
    category_id: products[0].category_id,
    product_id: products[0].id,
    product_name: products[0].name,
  });
}

async function sqlRequest(query) {
  const results = await dbConnect.promise().query(query);
  return results[0];
}

module.exports = { showKeyboard, answerKeyboard, ordering };

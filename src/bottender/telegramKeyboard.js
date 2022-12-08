class TelegramKeyboard {
  menuBuilder(mainMenuMap) {
    return {
      text: "Выберите пункт меню.",
      replyMarkup: this.generateInlineKeyboard(mainMenuMap),
    };
  }

  generateInlineKeyboard(table) {
    let keyboard = {
      inlineKeyboard: [],
    };
    for (const [key, value] of table) {
      keyboard.inlineKeyboard.push([
        {
          text: value,
          callbackData: key,
        },
      ]);
    }
    return keyboard;
  }
}

module.exports = new TelegramKeyboard();

const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");
const { TelegramClient } = require("messaging-api-telegram");
const { bottender } = require("bottender");
const { TELEGRAM_ACCESS_TOKEN, PORT } = process.env;
const { logger } = require("./log");


const server = express();
const dbConnect = require("./db_connection");
const verify = (req, _, buf) => {
  req.rawBody = buf.toString();
};
const Bottender = bottender({
  dev: process.env.NODE_ENV !== "production",
});

server.use(bodyParser.json({ verify, limit: "10mb" }));
server.use(bodyParser.urlencoded({ extended: false, verify, limit: "10mb" }));

ngrok
  .connect({
    proto: "http",
    addr: PORT,
  })
  .then((url) => {
    logger.info(`Tunnel Created -> ${url}`);
    logger.info("Tunnel Inspector ->  http://127.0.0.1:4040");

    server.listen(PORT, async (err) => {
      const handle = Bottender.getRequestHandler();
      server.all("*", (req, res) => handle(req, res));
      if (err) throw err;

      Bottender.prepare().then(() => {
        const client = TelegramClient.connect({
          accessToken: TELEGRAM_ACCESS_TOKEN,
        });
        client
          .setWebhook(url + "/webhooks/telegram")
          .then(() => logger.info(`set webhook success`))
          .catch((reason) => logger.error(`set webhook error: ${reason}`));
      });
    });
  });

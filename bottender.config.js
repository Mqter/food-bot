module.exports = {
  session: {
    driver: "file",
    expiresIn: "180",
    stores: { file: { dirname: ".sessions" } },
  },
  initialState: {},
  channels: {
    telegram: {
      enabled: true,
      path: "/webhooks/telegram",
      accessToken: process.env.TELEGRAM_ACCESS_TOKEN,
    },
  },
};

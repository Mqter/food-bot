const winston = require("winston");

const logFormat = winston.format.combine(
  winston.format.simple(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf((info) => `${info.timestamp}: ${info.message}`)
);

module.exports.logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  ],
});

import {configure, getLogger} from 'log4js';

configure({
    appenders: { [process.env.LOG_APPENDER]: { type: "dateFile", filename: process.env.LOG_FILE, pattern: '.yyyy-MM-dd-hh'},
                 [process.env.LOG_APPENDER_CONSOLE]: { type: 'console' } },
    categories: { default: { appenders: [process.env.LOG_APPENDER, process.env.LOG_APPENDER_CONSOLE], level: process.env.LOG_LEVEL} }
  });

const logger = getLogger(process.env.LOG_APPENDER);

module.exports = logger;
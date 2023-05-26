const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
const pgsql = require('think-model-postgresql');
const { Console, File, DateFile } = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development' || think.env === 'vercel';
const isVercel = think.env === 'vercel';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: isVercel
      ? '/tmp/cache'
      : path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'postgresql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  // vercel 创建 postgresql 数据库 https://vercel.com/dashboard/stores
  postgresql: {
    handle: pgsql,
    prefix: 'think_',
    user: 'default',
    password: '',
    database: 'verceldb',
    host: '',
    port: 5432,
    connectionLimit: 1,
    ssl: true // 开启ssl vercel必须
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: isVercel
      ? '/tmp/session'
      : path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

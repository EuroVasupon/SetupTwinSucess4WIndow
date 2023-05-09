export const outputPath = './src/database/models/';
export const outputPathChat = './src/databaseChat/models/';

export const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  schema: process.env.MYSQL_DATABASE || 'database'
};

export const dbConfigChat = {
  host: process.env.CHAT_MYSQL_HOST || 'localhost',
  port: process.env.CHAT_MYSQL_PORT || 3306,
  username: process.env.CHAT_MYSQL_USER || 'root',
  password: process.env.CHAT_MYSQL_PASSWORD || '',
  schema: process.env.CHAT_MYSQL_DATABASE || 'database'
};

export const dbTables = [
  'currencys',
  'games',
  'games_accounts',
  'history_login',
  'history_order',
  'history_topup_account',
  'orders',
  'orders_games',
  'orders_games_result_message',
  'order_game_account_package',
  'order_game_account_topup',
  'package_items',
  'packages',
  'permissions',
  'permissions_users',
  'platforms',
  'quick_banners',
  'quick_chats',
  'roles',
  'sms',
  'topups',
  'topup_accounts',
  'topup_account_stock_lot',
  'users'
];

export const dbTablesChat = ['user_chat'];

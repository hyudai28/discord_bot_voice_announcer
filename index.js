const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token, servers } = require("./config.json");

const clients = new Collection();
for (const server of servers) {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
  });
  client.commands = new Collection();

  // コマンドの読み込み
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  // イベントの読み込み
  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  // ログイン
  client.login(token);

  // クライアントをコレクションに追加
  clients.set(server.name, client);

  // configオブジェクトを作成
  clients.get(server.name).config = {};

  // チャンネルIDの設定
  clients.get(server.name).config.channelId = server.channelId;
}

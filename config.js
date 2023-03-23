// config.js
const config = require("./config.json");

function getChannelId(guildId) {
  const serverConfig = config.servers.find((server) => {
    if (server.guildId == guildId) {
      return server.channelId;
    }
  });
  if (serverConfig) return serverConfig;
  return null;
}

module.exports = { config, getChannelId };

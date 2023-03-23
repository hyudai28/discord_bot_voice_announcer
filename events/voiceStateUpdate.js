const { config, getChannelId } = require("../config");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    if (oldState.channelId !== newState.channelId) {
      if (!oldState.channel && newState.channel) {
        const newUser = await client.users.fetch(newState.member.id);
        const msg = `${newUser.username}がボイスチャットに入室しました。`;
        const server = getChannelId(newState.guild);

        if (server.channelId == client.config.channelId) {
          client.channels.cache.get(server.channelId).send(msg);
        }
      } else if (oldState.channel && !newState.channel) {
        const newUser = await client.users.fetch(oldState.member.id);
        const server = getChannelId(newState.guild);
        if (server.channelId == client.config.channelId) {
          const msg = `${newUser.username}が通話を終了しました。`;
          client.channels.cache.get(client.config.channelId).send(msg);
        }
      }
    }
  },
};

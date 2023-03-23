const { config, getChannelId } = require("../config");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    if (oldState.channelId !== newState.channelId) {
      if (!oldState.channel && newState.channel) {
        const newUser = await client.users.fetch(newState.member.id);
        const msg =
          ":blue_circle: " +
          newState.member.displayName +
          " が通話を開始しました :blue_circle:";
        const server = getChannelId(newState.guild);

        if (server.channelId == client.config.channelId) {
          client.channels.cache.get(server.channelId).send(msg);
        }
      } else if (oldState.channel && !newState.channel) {
        const newUser = await client.users.fetch(oldState.member.id);
        const server = getChannelId(newState.guild);
        if (server.channelId == client.config.channelId) {
          const msg =
            ":red_circle: " +
            newState.member.displayName +
            " が通話を終了しました :red_circle:";
          client.channels.cache.get(client.config.channelId).send(msg);
        }
      }
    }
  },
};

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { channelId } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });



client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// voiceAnnounce event
client.on("voiceStateUpdate", async (oldState, newState) => {
			// console.log("\n____________________________\n");
			// console.log("old channe=>" + oldState.channel);
			// console.log("old channelId=>" + oldState.channelId);
			// console.log("old member=>" + oldState.member);
			// console.log("old sessionId=>" + oldState.sessionId);

			// console.log("\n____________________________\n");
			// console.log("new channel=>" + newState.channel);
			// console.log("new channelId=>" + newState.channelId);
			// console.log("new member=>" + newState.member);
			// console.log("new member size=>" + newState.member.size);
			// console.log("new sessionId=>" + newState.sessionId);


			let newUser = await client.users.fetch(newState.member);
			console.log("fetch ->" + newUser.username);
			console.log("fetchId ->" + newUser);

        if(oldState.channel==null && newState.channel != null)
		{
            //ここはconnectしたときに発火する場所
            console.log(`connect`);
			let newUser = await client.users.fetch(newState.member);
			let msg = newUser.username + "がボイスチャットに入室しました。";
			client.channels.cache.get(channelId).send(msg);
        }
        if(oldState.channel !=null && newState.channel === null)
		{
            //ここはdisconnectしたときに発火する場所
            console.log(`disconnect`);
			let newUser = await client.users.fetch(oldState.member);
			let msg = newUser.username + "が通話を終了しました。";
			client.channels.cache.get(channelId).send(msg);
        }
});



const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
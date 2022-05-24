const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help'),
	async execute(interaction) {
		return interaction.reply('_____Voice Announcer help_____\n```1.ボイスチャンネルにユーザーが入退室すると通知が指定のテキストチャンネルに出力されます。\n2.通知希望者は指定のテキストチャンネルの通知をオンにしてください。```');
	},
};
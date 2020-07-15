const dotenv = require('dotenv');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const announcementHook = new Webhook(process.env.DISCORD_WEBHOOK_ANNOUNCEMENTS);

function announcementSend(title, url, body, cover, author, authorAvatar) {
    const embed = new MessageBuilder()
        .setTitle(title)
        .setURL('https://exordium.org/#/blog/' + url)
        .addField('First field', 'this is inline', true)
        .addField('Second field', 'this is not inline')
        .setColor(0x7289da)
        .setDescription(body)
        .setImage(cover)
        .setFooter(`Written by ${author}`, 'https://cdn.discordapp.com/embed/avatars/0.png')
        .setTimestamp();
 
    hook.send(embed).then(() => {
        return true;
    }).catch(err => {
        return false;
    });
}

module.exports = announcementSend;
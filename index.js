var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

const YTDL = require("ytdl-core");
const TOKEN = "Mzk3MDU5ODk2MDUyNTQ3NTk3.DTHfpg.M4AFCmIEJ3HWE8CIaMUnwEhHRA8";
const PREFIX = "/";
const Discord = require("discord.js");
const weather = require('weather-js');

function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: "audioonly" }));
    server.queue.shift();
    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

function botcalistir() {
    setInterval(function () { console.log('5 Dakika') }, 300000);
}
function mevlanasozleri() {

}

var fortunes = [
    "Evet",
    "Hayır",
    "Olabilir",
    "Kes sesini",
    "Nerden baksan öyle"
]
var sozler = [

]
var bot = new Discord.Client();

var servers = {};

bot.on("ready", function () {
    console.log("Hazır!");
    botcalistir();
    mevlanasozleri();
});

bot.on("guildMemberAdd", function (member) {
    member.guild.channels.find("name", "genel-sohbet").sendMessage(member.toString() + " Aramıza Hoşgeldin Dostum !!");
    member.addRole(member.guild.roles.find("name", "Game Of Player"));
});

bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");



    switch (args[0].toLowerCase()) {
        case "yardım":
            var embed = new Discord.RichEmbed();
            message.channel.sendEmbed(embed.setTitle("Komut Listesi").setColor('BLUE').setDescription("**/yardım , /ping , /hakkımızda , /sor <Soru> , /temizle <Mesaj Sayısı> , /zarsalla **"));
            break;
        case "ping":
            message.channel.sendMessage("Ping! Pong! Tong!");
            break;
        case "hakkımızda":
            message.channel.sendMessage("Biz Game Of Players Topluluğuyuz :heart:");
            break;
        case "kurallar":
            var embed = new Discord.RichEmbed();
            message.channel.sendEmbed(embed.setTitle("Kurallar")
                .setColor('GREEN')
                .setAuthor('Rounted', 'https://i.hizliresim.com/dOzYMQ.png')
                .setFooter('Buradaki discord sunucusu kurallarına uymayan kişiler uzaklaştırma cezası alacaktır.')
                .setDescription("**1-** Herhangi bir discorda adam çekmeye çalışmak bu topluluğu aşağılamak yasaktır.\n**2-**Şahsın ailevi değerlerine küfür veya hakaret yasaktır.\n**3-**Chatte aşırı derecede spam ve flood yapmak yasaktır.\n**4-**İnsanlarla saygılı konuşun.\n**5-**Burada herhangi bir hesap paylaşımı durumunda yetkililer sorumlu değildir."));

            break;
        case "sor":
            if (args[1])
                message.channel.sendMessage(message.author.toString() + ' ' + fortunes[Math.floor(Math.random() * fortunes.length)]);
            else
                message.channel.sendMessage("Anlayamadım dostum.");
            break;
        case "temizle":
            async function purge() {
                message.delete();

                if (!message.member.roles.find("name", "Sorumlu")) {
                    message.channel.send('Mesajları temizlemek için \`Sorumlu\` rolüne sahip olman gerek.');
                    return;
                }


                if (isNaN(args[1])) {
                    message.channel.send('**►** Lütfen mesaj sayısı belirtin.\n**►** Kullanımı : **' + PREFIX + 'temizle <Mesaj Sayısı>**');
                    return;
                }

                const fetched = await message.channel.fetchMessages({ limit: args[1] });
                console.log(fetched.size + ' mesaj siliniyor...');

                message.channel.bulkDelete(fetched)
                    .catch(error => message.channel.send(`Hata: ${error}`));

            }

            purge();
            break;
        case "zarsalla":
            var x = Math.floor((Math.random() * 6) + 1);
            message.channel.sendMessage(message.author.toString() + " Çıkan Sayı : " + x);
            break;
        case "havadurumu":
            if (args[1] != null) {
                weather.find({ search: args[1], degreeType: 'C' }, function (err, result) {
                    if (err) message.channel.send(err);

                    if (result.length === 0) {
                        message.channel.send('**Lütfen geçerli bir lokasyon giriniz.**')
                        return;
                    }
                    var current = result[0].current;
                    var location = result[0].location;

                    const embed = new Discord.RichEmbed()
                        .setDescription(`**${current.skytext}**`)
                        .setAuthor(`${current.observationpoint} için Hava Durumu Bilgileri`)
                        .setThumbnail(current.imageUrl)
                        .setColor('BLUE')
                        .addField('Sıcaklık', `${current.temperature} °C`, true)
                        .addField('Hissedilen', `${current.feelslike} °C`, true)
                        .addField('Rüzgar', current.winddisplay, true)
                        .addField('Nem', `${current.humidity}%`, true)


                    message.channel.send({ embed });
                });
            }
            else
            {
                message.channel.send('**Lütfen geçerli bir lokasyon giriniz.**')
            }
            break;
        /*  case "play":
              if (!args[1]) {
                  message.channel.sendMessage("Lütfen youtube linki atın.")
                  return;
              }
  
              if (!message.member.voiceChannel) {
                  message.channel.sendMessage("Lütfen herhangi bir ses kanalına bağlanın.");
                  return;
              }
  
              if (!servers[message.guild.id]) servers[message.guild.id] =
                  {
                      queue: []
                  };
  
  
              var server = servers[message.guild.id];
  
              server.queue.push(args[1]);
  
              if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                  play(connection, message);
              });
  
              break;
  
          case "skip":
              var server = servers[message.guild.id];
              if (server.dispatcher) server.dispatcher.end();
              break;
          case "stop":
              var server = servers[message.guild.id];
              if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
              break;*/


        default:
            message.channel.sendMessage("Böyle bir komut bulunamadı dostum. Lütfen **/yardım** yazarak komut listesine bir göz at.")
            break;
    }


});

bot.login(TOKEN);

app.listen(port);
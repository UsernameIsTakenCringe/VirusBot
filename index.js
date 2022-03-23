const Discord = require("discord.js")
const Canvas = require("canvas")
const Keyv = require("keyv")
const express = require("express")
const fs = require("fs")
const ffmpeg = require("ffmpeg")
const executeTriggers = require("./triggers.js")

const keyv = new Keyv("sqlite://database.sqlite")

const app = express()
const port = process.env.PORT || 3000

app.listen(port, function() {
  console.log("Listening")
})

app.get("/", function(req, res) {
    res.send("Sennin")
})

//===============================//
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

const PREFIX = "snn"

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

for(const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.on("ready", function() {
  console.log("Ready")

  fs.readdir("./temp", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file !== 'read.txt') {
        fs.unlink(`./temp/${file}`, err => {
          if (err) throw err;
        });
      }
    }
  })
})

client.on("messageCreate", function(message) {
  if(message.author.bot) { return }

  if(!message.content.toLowerCase().startsWith(PREFIX)) {
    return executeTriggers(message)
  }
  
  const args = message.content.slice(PREFIX.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if(!command) { return }

  try {
    command.execute(client, message, args)
  } catch(error) {
    console.error(error)
    message.reply("Error. Unable to execute the command")
  }
})

client.on("messageDelete", async function(message) {
  if(message.author.bot) { return }
  await keyv.set("deletedMessage", message, 20000)
})

client.on("messageUpdate", async function(oldMessage, newMessage) {
  if(oldMessage.author.bot) { return }
  await keyv.set("editedMessage", oldMessage, 20000)
})

client.login(process.env.TOKEN)
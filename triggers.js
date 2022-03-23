const Keyv = require("keyv")
const keyv = new Keyv("sqlite://database.sqlite")

module.exports = async function(message) {
  const content = message.content.toLowerCase()

  if(content.includes("dead") && content.includes("chat")) {
    message.channel.send("Yeah, well, what can you? ¯\_(ツ)_/¯")
  }
  if(content.includes("stfu")){
    message.channel.send("No you stfu")
  }
  //Yis
  if(message.author.id == "692491669265973339") {
    if(content.includes("hi ")) {
      message.channel.send("It's not a dad joke. It's a plea for help")
    }
    if(content.includes("cringe")){
      message.channel.send("No you're cringe")
    }
    if(content.includes("deez")) {
      message. channel.send("Your nuts have gonorrhea")
    }
    if(content.includes ("nut")) {
      message. channel.send("Im sorry but your nuts have terminal nut dementia")
    }
  }
  //Nerit
  if(message.author.id == "281414608017817600") {
    if(content.includes("ayo")) {
      message.channel.send("ayo to you too")
    }
  }
  //Eggy
  if(message.author.id == "500869315701243905") {
    if(content.includes("purple") && 
       content.includes("hippo")) {
      message.channel.send("Do you have some history with the purple hippo, eggy? <:hmmmm:935569765404135484>")
    }
    if(content.includes("damn")) {
      message.channel.send("damn")
    }
  }
  //Elite or Nerit
  if(message.author.id == "715479155533152297" || message.author.id == "281414608017817600") {
    if(content.includes("damn")) {
      message. channel.send("damn")
    }
  }
  //Elite or Nerit or Eggy
  if(message.author.id == "715479155533152297" || message.author.id == "281414608017817600" || message.author.id == "500869315701243905") {
    if(content.includes ("bru")) {
      message. channel.send("bru")
    }
  }

  if((Math.floor(Math.random()*100)<=20) &&
    content.includes ("<:deeplmao:935566604803125258>")) {
    message. channel.send("<:deeplmao:935566604803125258>")
  }

  if(content == "pls snipe") {
    const deletedMessage = await keyv.get("deletedMessage") ?? "There is nothing to snipe"
    message.channel.send(deletedMessage)
  }

  if(content == "pls esnipe") {
    const editedMessage = await keyv.get("editedMessage") ?? "There is nothing to snipe"
    message.channel.send(editedMessage)
  }
}

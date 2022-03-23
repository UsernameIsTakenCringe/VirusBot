const Canvas = require("canvas")
const ffmpeg = require("ffmpeg")
const fs = require("fs")
const fetch = require("node-fetch")

module.exports = {
  name: "overlay",
  description: "Creates text over a video (?or image)",
  requiresArgs: "yes",
  usage: "snn overlay [video] text",

  async execute(client, message, args) {
    var params = message.content.toLowerCase().replace("snn overlay", "").toUpperCase().split(",")
    params = params.map(element => {
      return element.trim()
    })

    var update// = message.channel.send("e")

    if (params == "") {
      return message.reply("You didn't specify text to overlay the video with")
    }
    if(message.attachments.first()) {
      if(message.attachments.first().name.endsWith(`mp4`)) {
        const check = await fs.promises.access("./temp/input.mp4", fs.constants.F_OK)
          .then(() => true)
          .catch(() => false)

        if(check == true) {
          return message.reply("I am already editing a video. Try again when I'm done")
        }
        update = await message.channel.send("Downloading...")
        await this.download(message.attachments.first().url)
      }
      else {
        return message.reply("That's not an mp4")
      }
    }
    else {
      return message.channel.send("You didn't send an mp4 file")
    }

    update.edit("Processing...")
    await this.edit(params[0], params[1])
    await message.channel.send({ files: ["./temp/output.mp4"] }).catch(error => message.channel.send(`${error}`))
    update.delete()

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
  },

  async edit(message1, message2 = null) {
    const video = await ffmpeg("./temp/input.mp4")
    const resolution = video.metadata.video.resolution

    const canvas = Canvas.createCanvas(resolution.w, resolution.h)
    const ctx = canvas.getContext('2d')

    ctx.text = (canvas, ctx, text, height) => {
      let fontSize = 100;
      do {
        ctx.font = `${fontSize -= 10}px Impact`
      } while (ctx.measureText(text).width / 2 > canvas.width / 2)

      ctx.lineWidth = 3
      ctx.textAlign = "center"
      ctx.fillStyle = "white"
      ctx.strokeStyle = "black"
      ctx.strokeText(text, canvas.width / 2, height)
      ctx.fillText(text, canvas.width / 2, height)
    }

    ctx.text(canvas, ctx, message1, 80)

    if(message2) {
      ctx.text(canvas, ctx, message2, canvas.height - 10)
    }

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./temp/overlay.png', buffer)

    const audioSize = video.metadata.audio.bitrate * video.metadata.duration.seconds * 1000

    const bitrate = Math.floor(((67108864 - audioSize) / 1.4) / video.metadata.duration.seconds / 1000)

    await video.setWatermark("./temp/overlay.png")
    await video.addCommand("-vb", bitrate + "k")
    await video.setAudioBitRate(video.metadata.audio.bitrate)
    await video.addCommand("-preset", "veryfast")
    await video.save("./temp/output.mp4")
  },

  async download(url) {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream("./temp/input.mp4");
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
  }
}

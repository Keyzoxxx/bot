const Discord = require("discord.js");
const fs = require("fs")
const intents = new Discord.Intents(32767);
const Command = require("./Command");
const Event = require("./Event");

class Client extends Discord.Client {

    constructor(options) {

        super({ intents });

        /**
         * @type {Discord.Collection<string, Command>}
        */

        this.commands = new Discord.Collection()
        this.alias = new Discord.Collection()
        this.color = "#00feff";
        this.tracker = InviteTracker.init(this, {
            fetchGuilds: true,
            fetchVanity: true,
            fetchAuditLogs: true,
        });
  }

  start(token) {


    console.log(`  ╔══════════════════════════════════════
  ║      Voici toutes les commandes 
  ║        et events disponibles`)
    fs.readdirSync("./Commandes/").forEach(dir => {
      fs.readdirSync(`./Commandes/${dir}/`).filter(file => file.endsWith(".js")).forEach(async f => {

      /**
             * @type {Command}
             */

      let props = require(`../Commandes/${dir}/${f}`);
      console.log(`  ║══════════════════════════════════════
  ║   ↳ ${f}
  ║     ↳ Commande chargée avec succès ! `);
      this.commands.set(props.name, props)
      if(props.alias.length !== 0) {
      props.alias.forEach(async a => {
        this.alias.set(a, props)
      })
     }
    })
  })
      

  fs.readdirSync("./Events/").filter(dir => dir !== "Invite").forEach(dirs => {
    
    fs.readdirSync(`./Events/${dirs}/`).filter(files => files.endsWith(".js")).forEach(async evt => {

        /**
         * @type {Event}
        */

        const event = require(`../Events/${dirs}/${evt}`);
        console.log(`  ║══════════════════════════════════════
  ║  ↳ ${event.event}.js
  ║    ↳ Événement chargé avec succès ! `);
        this.on(event.event, event.run.bind(null, this));
    })
});
}

module.exports = Client;

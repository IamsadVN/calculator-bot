# Calculator Discord Bot

A project to perform calculations on the Discord platform, running on NodeJS with the [discord.js](https://github.com/discordjs/discord.js/) package.

*Developed by Iamsad_VN for learning JavaScript.*

# Request
- NodeJS > 20
- MongoDB

# Installation
## Step 1: Clone this repository
```
git clone https://github.com/IamsadVN/calculator-bot
```
## Step 2: Install all the package
```
npm install 
```
## Step 3: Edit file `.env`
```
cp .env.example .env
```
Edit the values below:
- `BOT_TOKEN` = Token of the bot
- `PREFIX` = Prefix you want to user
- `MONGO_DB` = URI of MongoDB
- `WEBHOOK_ERROR` = Webhook that send error to the Server
- `WEBHOOK_GUILDJOIN` = Webhook that send embed about a guild the bot joined
- `WEBHOOK_GUILDLEFT` = Webhook that send embed about a guild the bot left
## Step 4: Run the bot
```
node .
```
# Contribution
All contributions are welcome (if they do not harm the Project).

You may fork this Project, but please credit me, that’s all.

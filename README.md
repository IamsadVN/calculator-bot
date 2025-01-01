# Calculator Discord Bot

A project to perform calculations on the Discord platform, running on NodeJS with the [discord.js](https://github.com/discordjs/discord.js/) package and [MathJS](https://github.com/josdejong/mathjs) package.

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
### *Bot information*
- `BOT_TOKEN` = Token of the bot
- `PREFIX` = Prefix you want to user
### *Embed color*
- `CALC` = The color of the embed to calculate
- `ERROR` = The color of the embed to notify error
### *Database of the bot*
- `MYSQL_HOST` = The IP (or domain) to connect to the MySQL Server
- `MYSQL_PORT` = The port to connect
- `MYSQL_USER` = The user to connect
- `MYSQL_PASSWORD` = The password to connect
- `MYSQL_DB` = The database to use to record
### *Webhook of the bot*
- `WEBHOOK_ERROR` = Webhook that send error to the Server
- `WEBHOOK_GUILDJOIN` = Webhook that send embed about a guild the bot joined
- `WEBHOOK_GUILDLEFT` = Webhook that send embed about a guild the bot left
### *Other*
- `DEBUG_LOG` = Turn on or off debug log mode
## Step 4: Run the bot
```
node .
```
# Contribution
All contributions are welcome (if they do not harm the Project).

You may fork this Project, but please credit me, that’s all.

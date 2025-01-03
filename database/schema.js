import mysql2 from "mysql2/promise";
import { config } from "dotenv";
import { debugLog, errorLog, infoLog } from "../src/utils/log.js";

config();

const connection = await mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    
    enableKeepAlive: true
});

infoLog(`MySQL connected, using database ${connection.config.database}`);


export class UserSetting {
    async writeUserLang({username,userId,userlang}) {
        const query = "INSERT INTO UserSetting (UserName,UserID,UserLang,CommandCount) VALUES (?,?,?,0) ON DUPLICATE KEY UPDATE UserName = ?, UserLang = ?";
        try {
            const [result] = await connection.execute(query,[username,userId,userlang,username,userlang]);

            debugLog("The result obj in writeUserLang",result);
        }
        catch (err) {
            errorLog(err);
        }
    };
    async getUserLang(userId) {
        const query = "SELECT * FROM UserSetting WHERE UserID = ?";
        try {
            const [result,fields] = await connection.execute(query,[userId]);

            debugLog("Fields obj in connection.execute to get user lang",fields);

            if (result.length > 0) return result[0].UserLang;
            else {
                await this.writeUserLang({
                    userId: userId,
                    userlang: "vi",
                    username: "missing_username"
                });
                return "vi";
            }
        }
        catch (err) {
            errorLog(err);
        }
    };
    async commandCount(userId) {
        const query = "UPDATE UserSetting SET CommandCount = CommandCount + 1 WHERE UserID = ?";
        try {
            const [result] = await connection.execute(query,[userId]);
            debugLog("Result obj:",result);
        } catch (err) {
            errorLog(err);
        }
    }
};

export class ServerSetting {
    /**
     * 
     * @param {Object} param0 Uhhh idk
     * @param {string} param0.servername Server name
     * @param {string} param0.serverid Server ID
     * @param {string} param0.serverlang Server Language
     * @param {number} param0.servermembers Server Members
     * @param {string} param0.serverowner Server Owner
     * @param {string} param0.serverownerid Server Owner ID
     */
    async writeServerLang({
        servername,
        serverid,
        serverlang,
        servermembers,
        serverowner,
        serverownerid
    }) {
        const query = "INSERT INTO ServerSetting (ServerName,ServerID,ServerLang,ServerMembers,ServerOwner,ServerOwnerID) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE ServerName = ?, ServerLang = ?, ServerMembers = ?, ServerOwner = ?, ServerOwnerID = ?";
        try {
            const [result] = await connection.execute(query,[servername,serverid,serverlang,servermembers,serverowner,serverownerid,servername,serverlang,servermembers,serverowner,serverownerid]);

            debugLog("Result obj in writeServerLang",result);
        } catch (err) {
            errorLog(err);
        }
    };
    async getServerLang(serverId) {
        const query = "SELECT * FROM ServerSetting WHERE ServerID = ?";
        try {
            const [result] = await connection.execute(query,[serverId]);

            debugLog("From getServerLang",result);

            if (result.length > 0) return result[0].ServerLang;
            else return "vi";
        } catch (err) {
            errorLog(err);
        }
    }
}

export default connection;
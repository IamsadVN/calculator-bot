import mysql2 from "mysql2";
import { config } from "dotenv";
import { debugLog, errorLog } from "../src/utils/log.js";

config();

const connection = mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    
    enableKeepAlive: true
});

export class UserSetting {
    writeUserLang({username,userId,userlang}) {
        const query = "INSERT INTO UserSetting (UserName,UserID,UserLang,CommandCount) VALUES (?,?,?,1) ON DUPLICATE KEY UPDATE UserName = ?, UserLang = ?";

        connection.query(query,[username,userId,userlang,username,userlang],(err,result) => {
            if (err) errorLog(err);
            //else debugLog(result);
        });
    };
    getUserLang(userId,callback) {
        const query = "SELECT * FROM UserSetting WHERE UserID = ?";
        connection.query(query,[userId],(err,result) => {
            if (err) {
                //errorLog(err);
                callback(err,null);
            }
            else {
                //debugLog(result);
                callback(null,result[0].UserLang);
            }
        });
    };
    commandCount(userId) {
        const query = "UPDATE UserSetting SET CommandCount = CommandCount + 1 WHERE UserID = ?";

        connection.query(query,[userId],(err,result) => {
            if (err) errorLog(err);
        });
    }
};

export class ServerSetting {
    writeServerLang({
        servername,
        serverid,
        serverlang,
        servermembers,
        serverowner,
        serverownerid
    }) {
        const query = "INSERT INTO ServerSetting (ServerName,ServerID,ServerLang,ServerMembers,ServerOwner,ServerOwnerID) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE ServerName = ?, ServerLang = ?, ServerMembers = ?, ServerOwner = ?, ServerOwnerID = ?";
        
        connection.query(query,[servername,serverid,serverlang,servermembers,serverowner,serverownerid,servername,serverlang,servermembers,serverowner,serverownerid], (err,result) => {
            if (err) errorLog(err);
        });
    };
    getServerLang(serverId,callback) {
        const query = "SELECT * FROM ServerSetting WHERE ServerID = ?";
        connection.query(query,[serverId],(err,result) => {
            if (err) {
                callback(err,null);
            }
            else callback(null,result[0].ServerLang);
        })
    }
}

export default connection;
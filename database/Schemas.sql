DROP DATABASE IF EXISTS discord;
CREATE DATABASE IF NOT EXISTS discord;

USE discord;

DROP TABLE IF EXISTS UserSetting;

CREATE TABLE UserSetting(
    id INT NOT NULL AUTO_INCREMENT,
    UserName VARCHAR(40) NOT NULL,
    UserID VARCHAR(20) NOT NULL, 
    UserLang VARCHAR(2) NOT NULL DEFAULT "vi",
    CommandCount INT NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    UNIQUE (UserID)
);

DROP TABLE IF EXISTS ServerSetting;

CREATE TABLE ServerSetting(
    id INT NOT NULL AUTO_INCREMENT,
    ServerName VARCHAR(270) NOT NULL,
    ServerID VARCHAR(25) NOT NULL,
    ServerLang VARCHAR(2) NOT NULL DEFAULT "vi",
    ServerMembers INT NOT NULL,
    ServerOwner VARCHAR(40) NOT NULL,
    ServerOwnerID VARCHAR(20) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (ServerID)
);

CREATE DATABASE "PMU";

CREATE TABLE "User" (
    "userId" serial PRIMARY KEY,
    "userName" text,
    "userPass" text
);

CREATE TABLE "Channel" (
    "channelId" serial PRIMARY KEY
);

CREATE TABLE "Game" (
    "gameId" serial PRIMARY KEY
);

CREATE TABLE "Admin" (
    "adminId" serial PRIMARY KEY
);

CREATE TABLE "ChannelAdmin" (
    "adminId" int REFERENCES "Admin" ("adminId"),
    "channelId" int REFERENCES "Channel" ("channelId"),
    PRIMARY KEY ("adminId", "channelId")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channelId" SERIAL NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelAdmin" INTEGER NOT NULL,
    "channelAdminImage" TEXT NOT NULL DEFAULT 'default_pic.jpg',
    "channelPassword" TEXT DEFAULT '',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "GameRoom" (
    "id" SERIAL NOT NULL,
    "player1SocketId" TEXT NOT NULL,
    "player2SocketId" TEXT,
    "player1Ready" BOOLEAN NOT NULL DEFAULT false,
    "player2Ready" BOOLEAN NOT NULL DEFAULT false,
    "nbBounces" INTEGER NOT NULL DEFAULT 0,
    "botGame" BOOLEAN NOT NULL DEFAULT false,
    "customGame" BOOLEAN NOT NULL DEFAULT false,
    "running" BOOLEAN NOT NULL DEFAULT false,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "finish" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "statId" INTEGER,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageId" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER,
    "message_text" TEXT,
    "message_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "Notif" (
    "notifId" SERIAL NOT NULL,
    "notif" TEXT NOT NULL,
    "notifDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notif_pkey" PRIMARY KEY ("notifId")
);

-- CreateTable
CREATE TABLE "PrivateMessage" (
    "privateMessageId" SERIAL NOT NULL,
    "messageHistory" TEXT[],
    "privateMessageDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderName" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,

    CONSTRAINT "PrivateMessage_pkey" PRIMARY KEY ("privateMessageId")
);

-- CreateTable
CREATE TABLE "QueueList" (
    "queueId" SERIAL NOT NULL,

    CONSTRAINT "QueueList_pkey" PRIMARY KEY ("queueId")
);

-- CreateTable
CREATE TABLE "Stat" (
    "statId" SERIAL NOT NULL,
    "gameRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("statId")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "gameRoomId" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScore" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "scoreA" INTEGER NOT NULL DEFAULT 0,
    "scoreB" INTEGER NOT NULL DEFAULT 0,
    "scorerId" INTEGER NOT NULL,
    "scoreId" INTEGER NOT NULL,

    CONSTRAINT "UserScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userName" TEXT,
    "matchmakingScore" INTEGER NOT NULL DEFAULT 1000,
    "gamePlayed" INTEGER NOT NULL DEFAULT 0,
    "gameWon" INTEGER NOT NULL DEFAULT 0,
    "queueId" INTEGER,
    "displayName" TEXT,
    "image" TEXT NOT NULL DEFAULT 'default_pic.jpg',
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "cookie" TEXT,
    "socket" TEXT,
    "status" TEXT DEFAULT 'offline',
    "A2F" BOOLEAN NOT NULL DEFAULT false,
    "A2FSecret" TEXT,
    "A2FUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserChannelMute" (
    "id" SERIAL NOT NULL,
    "mutedUntil" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "UserChannelMute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelOperator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelUserBan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GameRoomToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserStats" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Friendship" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelName_key" ON "Channel"("channelName");

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_statId_key" ON "GameRoom"("statId");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_gameRoomId_key" ON "Stat"("gameRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_gameRoomId_key" ON "Score"("gameRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "User_cookie_key" ON "User"("cookie");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelOperator_AB_unique" ON "_ChannelOperator"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelOperator_B_index" ON "_ChannelOperator"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelUser_AB_unique" ON "_ChannelUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelUser_B_index" ON "_ChannelUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelUserBan_AB_unique" ON "_ChannelUserBan"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelUserBan_B_index" ON "_ChannelUserBan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameRoomToUser_AB_unique" ON "_GameRoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameRoomToUser_B_index" ON "_GameRoomToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserStats_AB_unique" ON "_UserStats"("A", "B");

-- CreateIndex
CREATE INDEX "_UserStats_B_index" ON "_UserStats"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockUser_AB_unique" ON "_BlockUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockUser_B_index" ON "_BlockUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Friendship_AB_unique" ON "_Friendship"("A", "B");

-- CreateIndex
CREATE INDEX "_Friendship_B_index" ON "_Friendship"("B");

-- AddForeignKey
ALTER TABLE "GameRoom" ADD CONSTRAINT "GameRoom_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("statId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notif" ADD CONSTRAINT "Notif_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_senderName_fkey" FOREIGN KEY ("senderName") REFERENCES "User"("userName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_receiverName_fkey" FOREIGN KEY ("receiverName") REFERENCES "User"("userName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScore" ADD CONSTRAINT "UserScore_scorerId_fkey" FOREIGN KEY ("scorerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScore" ADD CONSTRAINT "UserScore_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("gameRoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "QueueList"("queueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannelMute" ADD CONSTRAINT "UserChannelMute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannelMute" ADD CONSTRAINT "UserChannelMute_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelOperator" ADD CONSTRAINT "_ChannelOperator_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelOperator" ADD CONSTRAINT "_ChannelOperator_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelUser" ADD CONSTRAINT "_ChannelUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelUser" ADD CONSTRAINT "_ChannelUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelUserBan" ADD CONSTRAINT "_ChannelUserBan_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelUserBan" ADD CONSTRAINT "_ChannelUserBan_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameRoomToUser" ADD CONSTRAINT "_GameRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameRoomToUser" ADD CONSTRAINT "_GameRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStats" ADD CONSTRAINT "_UserStats_A_fkey" FOREIGN KEY ("A") REFERENCES "Stat"("statId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStats" ADD CONSTRAINT "_UserStats_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockUser" ADD CONSTRAINT "_BlockUser_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockUser" ADD CONSTRAINT "_BlockUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

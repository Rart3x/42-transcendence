-- CreateTable
CREATE TABLE "Waiter" (
    "waiterId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userSocket" TEXT NOT NULL,

    CONSTRAINT "Waiter_pkey" PRIMARY KEY ("waiterId","userId")
);

-- AddForeignKey
ALTER TABLE "Waiter" ADD CONSTRAINT "Waiter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

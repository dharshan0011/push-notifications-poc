-- CreateTable
CREATE TABLE "Keys" (
    "id" SERIAL NOT NULL,
    "auth" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,

    CONSTRAINT "Keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3),
    "keysID" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_keysID_key" ON "Subscription"("keysID");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_keysID_fkey" FOREIGN KEY ("keysID") REFERENCES "Keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Briefing" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "isTwo" BOOLEAN NOT NULL,
    "isCustomVoice" BOOLEAN NOT NULL,

    CONSTRAINT "Briefing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "briefingId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "isUserAdded" BOOLEAN NOT NULL,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audio_briefingId_key" ON "Audio"("briefingId");

-- AddForeignKey
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_briefingId_fkey" FOREIGN KEY ("briefingId") REFERENCES "Briefing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Audio" ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Briefing" ADD COLUMN     "originalText" TEXT;

-- CreateEnum
CREATE TYPE "Speaker" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "DocumentInfo" ALTER COLUMN "xpath" DROP NOT NULL;
ALTER TABLE "DocumentInfo" ALTER COLUMN "branch" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Conversation" (
    "user_id" STRING NOT NULL,
    "entry" STRING,
    "speaker" "Speaker" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("user_id")
);

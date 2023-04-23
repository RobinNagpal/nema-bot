-- CreateEnum
CREATE TYPE "Speaker" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "Conversation" (
    "user_id" STRING NOT NULL,
    "entry" STRING,
    "speaker" "Speaker" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "DocumentInfo" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "xpath" STRING,
    "url" STRING NOT NULL,
    "type" STRING NOT NULL,
    "branch" STRING,

    CONSTRAINT "DocumentInfo_pkey" PRIMARY KEY ("id")
);

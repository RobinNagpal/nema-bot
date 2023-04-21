-- CreateTable
CREATE TABLE "DocumentInfo" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "xpath" STRING NOT NULL,
    "url" STRING NOT NULL,
    "type" STRING NOT NULL,
    "branch" STRING NOT NULL,

    CONSTRAINT "DocumentInfo_pkey" PRIMARY KEY ("id")
);

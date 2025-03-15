/*
  Warnings:

  - You are about to drop the column `socialProfile` on the `Instructor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "socialProfile";

-- CreateTable
CREATE TABLE "SocialProfile" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "instructorId" INTEGER NOT NULL,

    CONSTRAINT "SocialProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialProfile" ADD CONSTRAINT "SocialProfile_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

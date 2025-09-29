-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('GENERAL', 'RELEASES', 'EVENTS', 'INTERVIEWS', 'INDUSTRY');

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_artistId_fkey";

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "featuredPlaylist" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "excerpt" VARCHAR(200) NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "NewsCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "links" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

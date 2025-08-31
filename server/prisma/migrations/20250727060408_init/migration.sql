/*
  Warnings:

  - You are about to drop the column `blogId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `redirect` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followerCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `notificationsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `blogId` on the `View` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `View` table. All the data in the column will be lost.
  - You are about to drop the `About` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlogLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Error` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bookmarkedBy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `postId` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "About" DROP CONSTRAINT "About_userId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_userId_fkey";

-- DropForeignKey
ALTER TABLE "BlogLike" DROP CONSTRAINT "BlogLike_blogId_fkey";

-- DropForeignKey
ALTER TABLE "BlogLike" DROP CONSTRAINT "BlogLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_blogId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Error" DROP CONSTRAINT "Error_logId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportedBlogId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportedCommentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_logId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_blogId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_bookmarkedBy" DROP CONSTRAINT "_bookmarkedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_bookmarkedBy" DROP CONSTRAINT "_bookmarkedBy_B_fkey";

-- DropIndex
DROP INDEX "Comment_userId_blogId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "User_username_email_id_idx";

-- DropIndex
DROP INDEX "View_userId_blogId_idx";

-- DropIndex
DROP INDEX "View_userId_blogId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "blogId",
DROP COLUMN "content",
DROP COLUMN "likeCount",
DROP COLUMN "parentId",
DROP COLUMN "updatedAt",
ADD COLUMN     "postId" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "read",
DROP COLUMN "redirect",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coverImage",
DROP COLUMN "emailVerified",
DROP COLUMN "followerCount",
DROP COLUMN "followingCount",
DROP COLUMN "image",
DROP COLUMN "notificationsCount",
DROP COLUMN "role",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profileImage" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "View" DROP COLUMN "blogId",
DROP COLUMN "updatedAt",
ADD COLUMN     "postId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "About";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "BlogLike";

-- DropTable
DROP TABLE "CommentLike";

-- DropTable
DROP TABLE "Error";

-- DropTable
DROP TABLE "Follows";

-- DropTable
DROP TABLE "Log";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_BlogToTag";

-- DropTable
DROP TABLE "_bookmarkedBy";

-- DropEnum
DROP TYPE "ReportStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Severity";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followeeId_key" ON "Follow"("followerId", "followeeId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

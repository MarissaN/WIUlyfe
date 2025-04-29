/*
  Warnings:

  - Added the required column `courseId` to the `RegisteredCourse` table without a default value. This is not possible if the table is not empty.
*/
-- AlterTable
ALTER TABLE "RegisteredCourse" ADD COLUMN "courseId" INTEGER DEFAULT 11 NOT NULL;

-- AddForeignKey
ALTER TABLE "RegisteredCourse" ADD CONSTRAINT "RegisteredCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

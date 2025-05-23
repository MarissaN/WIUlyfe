-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisteredCourse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "grade" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RegisteredCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RegisteredCourse" ADD CONSTRAINT "RegisteredCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryInstructor" (
    "categoryId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,

    CONSTRAINT "CategoryInstructor_pkey" PRIMARY KEY ("categoryId","instructorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_label_key" ON "Category"("label");

-- AddForeignKey
ALTER TABLE "CategoryInstructor" ADD CONSTRAINT "CategoryInstructor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryInstructor" ADD CONSTRAINT "CategoryInstructor_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `categoryId` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- Crear tabla Category primero
CREATE TABLE "Category" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

-- Crear categoría por defecto
INSERT INTO "Category" ("id", "name") VALUES (1, 'Sin categoría');

-- Agregar columna description y categoryId con DEFAULT 1
ALTER TABLE "Dish" ADD COLUMN "description" TEXT;
ALTER TABLE "Dish" ADD COLUMN "categoryId" INTEGER NOT NULL DEFAULT 1;

-- Agregar relación FK
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

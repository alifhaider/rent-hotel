/*
  Warnings:

  - You are about to drop the column `facebook` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Hotel` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    CONSTRAINT "Links_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "typeId" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hostId" TEXT NOT NULL,
    CONSTRAINT "Hotel_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "HotelType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Hotel_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Hotel" ("address", "city", "createdAt", "description", "email", "hostId", "id", "imageUrl", "latitude", "longitude", "name", "phone", "state", "typeId", "updatedAt", "zip") SELECT "address", "city", "createdAt", "description", "email", "hostId", "id", "imageUrl", "latitude", "longitude", "name", "phone", "state", "typeId", "updatedAt", "zip" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Links_hotelId_key" ON "Links"("hotelId");

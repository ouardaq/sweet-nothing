-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "flavor" TEXT,
ADD COLUMN     "spriteKey" TEXT NOT NULL DEFAULT 'mochi',
ADD COLUMN     "spriteSwap" JSONB,
ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "list",
DROP COLUMN "paragraphs",
DROP COLUMN "quote",
DROP COLUMN "quoteAuthor",
DROP COLUMN "subheading",
ALTER COLUMN "content" SET NOT NULL;

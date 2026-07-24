-- CreateTable
CREATE TABLE "WeddingStory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "story" TEXT[],
    "guests" INTEGER NOT NULL,
    "vendors" INTEGER NOT NULL,
    "celebrationDays" INTEGER NOT NULL,
    "budget" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "photographer" TEXT NOT NULL,
    "decor" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingStoryImage" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "storyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeddingStoryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingStoryTimeline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "storyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeddingStoryTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeddingStory_slug_key" ON "WeddingStory"("slug");

-- CreateIndex
CREATE INDEX "WeddingStory_featured_idx" ON "WeddingStory"("featured");

-- CreateIndex
CREATE INDEX "WeddingStory_published_idx" ON "WeddingStory"("published");

-- CreateIndex
CREATE INDEX "WeddingStory_slug_idx" ON "WeddingStory"("slug");

-- AddForeignKey
ALTER TABLE "WeddingStory" ADD CONSTRAINT "WeddingStory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingStoryImage" ADD CONSTRAINT "WeddingStoryImage_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "WeddingStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingStoryTimeline" ADD CONSTRAINT "WeddingStoryTimeline_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "WeddingStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

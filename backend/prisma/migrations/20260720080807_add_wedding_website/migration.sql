-- CreateTable
CREATE TABLE "WeddingWebsite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "brideName" TEXT,
    "groomName" TEXT,
    "weddingDate" TIMESTAMP(3),
    "heroImage" TEXT,
    "storyTitle" TEXT,
    "storyDescription" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'classic',
    "template" TEXT NOT NULL DEFAULT 'royal',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingWebsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeddingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingGallery" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeddingGallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeddingWebsite_userId_key" ON "WeddingWebsite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingWebsite_slug_key" ON "WeddingWebsite"("slug");

-- CreateIndex
CREATE INDEX "WeddingWebsite_slug_idx" ON "WeddingWebsite"("slug");

-- CreateIndex
CREATE INDEX "WeddingEvent_websiteId_idx" ON "WeddingEvent"("websiteId");

-- CreateIndex
CREATE INDEX "WeddingGallery_websiteId_idx" ON "WeddingGallery"("websiteId");

-- AddForeignKey
ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingEvent" ADD CONSTRAINT "WeddingEvent_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "WeddingWebsite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingGallery" ADD CONSTRAINT "WeddingGallery_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "WeddingWebsite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

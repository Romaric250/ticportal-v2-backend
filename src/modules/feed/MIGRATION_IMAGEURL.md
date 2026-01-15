# Database Migration Required

## Changes Made:
- ✅ **Schema Updated**: `imageUrl` → `imageUrls` (String → String[])
- ✅ **Types Updated**: `CreatePostInput` and `UpdatePostInput` now use `imageUrls: string[]`
- ✅ **Service Updated**: Handles array of image URLs
- ✅ **README Updated**: Documentation reflects multiple images

## Migration Steps:

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Push to Database
```bash
npx prisma db push
```

⚠️ **Note**: Existing posts with `imageUrl` (single string) will need migration. Consider running a data migration script:

```typescript
// Migration script (optional)
const migratePosts = async () => {
  const posts = await db.feedPost.findMany({
    where: {
      imageUrl: { not: null }
    }
  });

  for (const post of posts) {
    await db.feedPost.update({
      where: { id: post.id },
      data: {
        imageUrls: [post.imageUrl], // Wrap single image in array
        imageUrl: null, // Clear old field
      }
    });
  }
};
```

## New API Format:

### Creating Post with Multiple Images:
```json
POST /api/feed/posts
{
  "content": "Check out these photos!",
  "category": "GENERAL",
  "imageUrls": [
    "https://utfs.io/f/image1.jpg",
    "https://utfs.io/f/image2.jpg",
    "https://utfs.io/f/image3.jpg"
  ]
}
```

### Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "imageUrls": [
      "https://utfs.io/f/image1.jpg",
      "https://utfs.io/f/image2.jpg",
      "https://utfs.io/f/image3.jpg"
    ],
    ...
  }
}
```

## Frontend Usage:

```typescript
// Upload multiple images
const uploadImages = async (files: File[]) => {
  const urls: string[] = [];
  
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    
    const { data } = await response.json();
    urls.push(data.url);
  }
  
  return urls;
};

// Create post with multiple images
const images = await uploadImages(selectedFiles);
await createPost({
  content: "My post",
  category: "GENERAL",
  imageUrls: images
});
```

## Benefits:

✅ **Multi-Image Support**: Posts can now have multiple images  
✅ **Gallery View**: Frontend can render image carousels  
✅ **Better UX**: Users can share multiple photos at once  
✅ **Backward Compatible**: Empty array `[]` for no images  

🚀 **Run the migrations and restart your server!**

# 🧠 Smart Feed Algorithm Documentation

## 🎯 **Algorithm Overview**

The TIC Portal feed uses a **multi-factor ranking algorithm** that balances:
- ✅ **Recency** (40%) - Fresh content gets priority
- ✅ **Engagement** (35%) - Popular posts rise up
- ✅ **Diversity** (15%) - Varied authors and content
- ✅ **Randomness** (10%) - Serendipitous discovery

---

## 📊 **How It Works**

### **1. Scoring System**

Each post gets a score based on multiple factors:

```typescript
Final Score = (Recency × 0.4) + (Engagement × 0.35) + (Randomness × 0.25)
```

#### **Recency Score (40% weight)**
```typescript
Recency = e^(-age_in_hours / 24)
```
- New posts (< 1 hour): Score ≈ 0.96-1.0
- Recent posts (1-6 hours): Score ≈ 0.78-0.96
- Day-old posts (24 hours): Score ≈ 0.37
- Week-old posts: Score ≈ 0.04

**Exponential decay** ensures fresh content dominates without completely hiding older posts.

#### **Engagement Score (35% weight)**
```typescript
Raw Engagement = (likes × 1) + (comments × 3) + (views × 0.05) + (bookmarks × 2)
Normalized = log₁₀(Raw + 1) / 3
```

**Why log scale?**
- Prevents viral posts from dominating entire feed
- Post with 10 likes ≈ 0.33
- Post with 100 likes ≈ 0.67
- Post with 1000 likes ≈ 1.0

**Comment Weight = 3×** - Comments indicate higher engagement than likes

#### **Randomness (25% weight)**
- Adds variety and prevents echo chambers
- Introduces serendipity
- Helps new authors get discovered

---

### **2. Diversity Filter**

After initial scoring, the algorithm applies **diversity constraints**:

```typescript
MAX_CONSECUTIVE_FROM_SAME_AUTHOR = 2
```

**How it works:**
1. Sort posts by score
2. Iterate through sorted list
3. Check if author appeared in last 2 posts
4. If yes, skip to next post from different author
5. Maintain sliding window of recent authors

**Result:** Users see varied content, not just posts from one popular author.

---

## 🔥 **Feed Flow Example**

### **Page 1 (First Load)**

```
User opens feed → GET /api/feed/posts?page=1&limit=10

Backend:
1. Fetch 30 posts (3× requested for ranking)
2. Calculate score for each post:
   - Post A (2h old, 50 likes, 10 comments): Score = 0.82
   - Post B (1h old, 5 likes, 2 comments): Score = 0.88
   - Post C (5h old, 200 likes, 50 comments): Score = 0.79
3. Sort by score: B (0.88), A (0.82), C (0.79), ...
4. Apply diversity filter
5. Return top 10 posts

User sees:
📱 [Pinned Posts if any]
📱 Post B (newest, moderate engagement)
📱 Post A (recent, good engagement)  
📱 Post C (older but viral)
📱 Post D (fresh, low engagement) ← Gets a chance!
📱 ...
```

### **Page 2 (Scroll Down)**

```
User scrolls → GET /api/feed/posts?page=2&limit=10

Backend:
1. Skip first 10 posts
2. Fetch next 30 for ranking
3. Apply same algorithm
4. Return next 10 best posts

Result: Mix of engagement and recency continues
```

---

## 📈 **Score Examples**

### **Scenario 1: Brand New Post**
```
Post: Just published (5 minutes ago)
Likes: 0, Comments: 0, Views: 5

Recency Score: 0.997 (nearly perfect)
Engagement Score: 0.18 (log₁₀(0.25 + 1) / 3)
Random: 0.15 (random value)

Final Score = 0.997×0.4 + 0.18×0.35 + 0.15×0.25 
            = 0.399 + 0.063 + 0.038
            = 0.50 ✅ Good placement!
```

### **Scenario 2: Viral Old Post**
```
Post: 48 hours old
Likes: 500, Comments: 100, Views: 2000

Recency Score: 0.14 (low due to age)
Engagement Score: 0.88 (high engagement)
Random: 0.12

Final Score = 0.14×0.4 + 0.88×0.35 + 0.12×0.25
            = 0.056 + 0.308 + 0.030
            = 0.39 ✅ Still visible but not dominating
```

### **Scenario 3: Recent Popular Post**
```
Post: 3 hours old
Likes: 100, Comments: 25, Views: 500

Recency Score: 0.88 (good)
Engagement Score: 0.72 (very good)
Random: 0.18

Final Score = 0.88×0.4 + 0.72×0.35 + 0.18×0.25
            = 0.352 + 0.252 + 0.045
            = 0.65 ✅ TOP OF FEED!
```

---

## 🎮 **Algorithm Behavior**

### **What Users Experience:**

**First 3-5 posts:** 
- Mix of newest posts (last 1-2 hours)
- Posts with good engagement
- At least one fresh post (<30 min) guaranteed

**Next 5-10 posts:**
- Balance shifts toward engagement
- Still showing recent posts (< 6 hours)
- Varied authors

**After page 2:**
- Older but highly engaging content
- Mix continues with more weight on engagement
- Serendipitous discoveries

---

## ⚙️ **Tuning Parameters**

### **Current Configuration:**
```typescript
RANKING: {
  RECENCY_WEIGHT: 0.4,      // Favor fresh content
  ENGAGEMENT_WEIGHT: 0.35,   // Reward popular posts
  DIVERSITY_WEIGHT: 0.15,    // Mix authors
  PERSONALIZATION_WEIGHT: 0.10, // Future: user preferences
}

ENGAGEMENT: {
  LIKE_SCORE: 1,
  COMMENT_SCORE: 3,     // Comments > Likes
  VIEW_SCORE: 0.05,     // Minimal weight
  BOOKMARK_SCORE: 2,
}

TIME_DECAY: {
  HALF_LIFE_HOURS: 24,  // 50% weight loss per day
  MAX_AGE_DAYS: 30,     // Don't show ancient posts
}
```

### **Easy Adjustments:**

Want **more fresh content**?
```typescript
RECENCY_WEIGHT: 0.5  // Increase from 0.4
ENGAGEMENT_WEIGHT: 0.3  // Decrease from 0.35
```

Want **more viral content**?
```typescript
RECENCY_WEIGHT: 0.3
ENGAGEMENT_WEIGHT: 0.5
```

Want **more variety**?
```typescript
RANDOMNESS: 0.3  // Increase random factor
```

---

## 🧪 **Testing the Algorithm**

### **Test Scenarios:**

**1. New Post Visibility**
```bash
# Create a post
POST /api/feed/posts
{ "content": "Test new post" }

# Immediately check feed
GET /api/feed/posts?page=1&limit=10

# Should appear in top 5! ✅
```

**2. Engagement Boost**
```bash
# Get 10 people to like a 1-hour old post
# Check feed
GET /api/feed/posts?page=1&limit=10

# Post should move up! ✅
```

**3. Diversity Check**
```bash
# Check if same author appears consecutively
GET /api/feed/posts?page=1&limit=20

# Count consecutive posts from same author
# Should never exceed 2! ✅
```

---

## 📊 **Algorithm Metrics**

### **What to Monitor:**

1. **Content Freshness**
   - Average age of posts in top 10
   - Target: < 6 hours

2. **Engagement Distribution**
   - Posts with 0 engagement in top 20
   - Target: 10-20% (gives new content a chance)

3. **Author Diversity**
   - Unique authors in top 20 posts
   - Target: >15 unique authors

4. **User Retention**
   - Time spent scrolling
   - Posts viewed per session
   - Target: 20+ posts per session

---

## 🚀 **Future Enhancements**

### **Planned Features:**

1. **Personalization (10% weight)**
   - User's followed authors get boost
   - Preferred categories get priority
   - Past engagement history

2. **Content Quality Signals**
   - Link previews reduce score
   - High-quality images boost score
   - Video content gets boost

3. **Social Graph**
   - Posts from squad members prioritized
   - Team posts get higher visibility

4. **A/B Testing**
   - Test different weight configurations
   - Measure engagement impact

---

## 💡 **Best Practices**

### **For Content Creators:**

✅ **Post at peak times** - Recency matters  
✅ **Encourage comments** - Worth 3× likes  
✅ **Use relevant tags** - Helps discovery  
✅ **Add images/video** - Increases engagement  
✅ **Engage with comments** - Keeps post active  

### **For Platform:**

✅ **Monitor feed health** - Check diversity metrics  
✅ **Adjust weights seasonally** - More recency during events  
✅ **Combat spam** - Detect artificial engagement  
✅ **Gather feedback** - Ask users about feed quality  

---

## 🎯 **Summary**

The smart feed algorithm ensures:
- ✅ **New creators get visibility**
- ✅ **Quality content rises to top**
- ✅ **Feed stays fresh and diverse**
- ✅ **Users discover varied content**
- ✅ **No single author dominates**

**Result:** An engaging, fair, and addictive feed experience! 🎉

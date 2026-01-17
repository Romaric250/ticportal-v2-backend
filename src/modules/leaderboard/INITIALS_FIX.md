// Quick fix for initials generation
// Apply this change in getStudentsLeaderboard method around line 140-170

// Replace this line:
// initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),

// With this safe version:
const firstName = user.firstName?.trim() || "";
const lastName = user.lastName?.trim() || "";
let initials = "??";

if (firstName && lastName) {
  initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
} else if (firstName && firstName.length >= 2) {
  initials = firstName.substring(0, 2).toUpperCase();
} else if (firstName) {
  initials = firstName[0].toUpperCase();
} else if (lastName && lastName.length >= 2) {
  initials = lastName.substring(0, 2).toUpperCase();
} else if (lastName) {
  initials = lastName[0].toUpperCase();
}

const entry: StudentLeaderboardEntry = {
  id: up.userId,
  userId: user.id,
  rank: currentRank,
  name: `${firstName} ${lastName}`.trim() || "Unknown User",
  school: user.school || "N/A",
  avatarUrl: user.profilePhoto,
  initials,  // Use the safely generated initials
  totalTP,
  badges: user.userBadges.map((ub) => ub.badgeId),
  activityTrend,
  rankChange,
  email: user.email,
};

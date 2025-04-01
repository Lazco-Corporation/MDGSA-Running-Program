export function isBanned(email: string) {
  const bannedStudentIds = [
    "11v176",
    "11v342",
    "11v496",
    "11s526",
    "11v492",
    "11s121",
    "11v547",
  ];

  if (bannedStudentIds.includes(email.split("@")[0])) {
    return true;
  }

  return false;
}

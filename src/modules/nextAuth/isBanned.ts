export function isBanned(email: string) {
  const bannedStudentIds = new Set([
    "11v176",
    "11v342",
    "11v496",
    "11s526",
    "11v492",
    "11s121",
    "11v547",
    "11v492",
    "11v547",
    "11v321",
    "11v342",
    "11v489",
    "11s111",
    "11v876",
    "11v863",
    "11v653",
  ]);

  if (Array.from(bannedStudentIds).includes(email.split("@")[0])) {
    return true;
  }

  return false;
}

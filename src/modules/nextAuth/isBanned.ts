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
    "11v489",
    "11s111",
    "11v876",
    "11v863",
    "11v653",
    "11v805",
    "11v312",
    "11v359",
    "11j758",
    "11v840",
    "11v005",
    "11v610",
    "11v066",
    "11v473",
    "11v430",
    "11s406",
    "11s466",
    "11s267",
    "11s512",
    "11s188",
    "11s395",
    "11s103",
    "11s258",
    "11s398",
    "11s354",
    "11v826",
  ]);

  if (Array.from(bannedStudentIds).includes(email.split("@")[0])) {
    return true;
  }

  return false;
}

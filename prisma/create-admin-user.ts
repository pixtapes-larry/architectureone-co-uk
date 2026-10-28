// One-off creation of the first AdminUser — no self-registration exists,
// so this is the only way to get a login into the system. Run once;
// re-running with the same email updates that user's password instead of
// creating a duplicate.
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const name = process.argv[3];
  const password = process.argv[4];

  if (!email || !name || !password) {
    console.error(
      "Usage: tsx prisma/create-admin-user.ts <email> <name> <password>",
    );
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name },
    create: { email: email.toLowerCase(), name, passwordHash },
  });

  console.log(`Admin user ready: ${user.email} (id ${user.id})`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

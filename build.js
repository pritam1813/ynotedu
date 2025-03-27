const { execSync } = require("child_process");

try {
  console.log("Running prisma migrate deploy...");
  execSync("prisma migrate deploy", { stdio: "inherit" });

  console.log("Running next build...");
  execSync("next build", { stdio: "inherit" });

  if (process.env.SEED_ON_DEPLOY === "true") {
    console.log("Running seed script...");
    execSync("pnpm seed", { stdio: "inherit" });
  } else {
    console.log("Skipping seed script (SEED_ON_DEPLOY is not 'true')");
  }
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
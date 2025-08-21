// import fs from "fs";
// import { execSync } from "child_process";

import fs from "fs";
import { execSync } from "child_process";

function run(cmd) {
  return execSync(cmd, { stdio: "inherit" });
}

function getTodayFilePath() {
  const today = new Date().toISOString().slice(0, 10);
  return `data/${today}.md`;
}

function getCommitCountToday() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const log = execSync(`git log --since=${today} --oneline`).toString();
    return log.split("\n").filter(Boolean).length;
  } catch {
    return 0;
  }
}

function createDailyContent() {
  const today = new Date().toISOString().slice(0, 10);
  const content = `# Update - ${today}\n\n- Generated at ${new Date().toLocaleString()}`;
  const filePath = getTodayFilePath().replace(".md", `-${Date.now()}.md`);
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
}

function commitAndPush(filePath) {
//   run("git pull --rebase");
  run(`git add ${filePath}`);
  run(`git commit -m "Auto update ${filePath}" || echo "Nothing to commit"`);
  run("git push origin main");
}

function main() {
  const todayCommits = getCommitCountToday();
  if (todayCommits >= 2) {
    console.log("⚠️ Already reached 2 commits today. Skipping.");
    return;
  }

  const newFile = createDailyContent();
  commitAndPush(newFile);
  console.log("✅ Commit done:", newFile);
}

main();

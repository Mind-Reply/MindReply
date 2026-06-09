import fs from "node:fs";
import { buildOwnerReport, ensureReportDir, REPORT_PATH } from "./report-shared.mjs";

ensureReportDir();
fs.writeFileSync(REPORT_PATH, buildOwnerReport(), "utf8");
console.log(`Owner report written: ${REPORT_PATH}`);

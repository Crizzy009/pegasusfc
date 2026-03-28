import "./loadEnv.js";
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 5174);

createApp()
  .then((app) => {
    app.listen(port, () => {
      process.stdout.write(`Admin API running on http://localhost:${port}\n`);
    });
  })
  .catch((e) => {
    process.stderr.write(`${e?.stack || e}\n`);
    process.exit(1);
  });

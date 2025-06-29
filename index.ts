// index.ts

import app from "playmap-backend/src/app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
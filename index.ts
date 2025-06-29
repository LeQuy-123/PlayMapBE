// index.ts
import express from "express";
import usersRoute from "./routes/users";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/users", usersRoute);

app.get("/", (_, res) => {
  res.send("✅ Supabase API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

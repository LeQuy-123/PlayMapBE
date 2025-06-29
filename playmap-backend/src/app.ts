import * as express from "express";

const app = express();

app.use(express.json());
// app.use("/users", usersRoute);

app.get("/", (_, res) => {
  res.send("✅ Supabase API is running!");
});

export default app;

import express from "express";
import usersRouter from "~routes/users";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);

app.get("/", (_, res) => {
  res.send("✅ Supabase API is running!");
});

export default app;

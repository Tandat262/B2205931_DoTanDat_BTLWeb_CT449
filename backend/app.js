const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Quản lý mượn sách" });
});



app.use("/api/admin", require("./app/routes/admin.routes"));
app.use("/api/public", require("./app/routes/public.routes"));
app.use("/api/auth", require("./app/routes/auth.routes"));



app.use((req, res, next) => next(new (require("./app/api-error"))(404, "Resource not found")));
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
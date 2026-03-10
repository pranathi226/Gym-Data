const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "🏋️ Gym Data API Server",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            getData: "GET /api/data/:table",
            insertData: "POST /api/data/:table",
            updateData: "PUT /api/data/:table/:id",
            deleteData: "DELETE /api/data/:table/:id",
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🏋️ Server running on http://localhost:${PORT}`);
});

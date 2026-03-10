const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// Health check route
router.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

// Example: Get all records from a table
router.get("/data/:table", async (req, res) => {
    try {
        const { table } = req.params;
        const { data, error } = await supabase.from(table).select("*");

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Example: Insert a record into a table
router.post("/data/:table", async (req, res) => {
    try {
        const { table } = req.params;
        const { data, error } = await supabase.from(table).insert(req.body).select();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Example: Update a record by ID
router.put("/data/:table/:id", async (req, res) => {
    try {
        const { table, id } = req.params;
        const { data, error } = await supabase
            .from(table)
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Example: Delete a record by ID
router.delete("/data/:table/:id", async (req, res) => {
    try {
        const { table, id } = req.params;
        const { data, error } = await supabase
            .from(table)
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Fetch all residents sorted by Block (case-insensitive) and Flat Number
router.get("/show", async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM residents ORDER BY BINARY UPPER(block) ASC, flat_number ASC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
});


// Search resident by block and flat number
router.get("/search", async (req, res) => {
    const { block, flat_number } = req.query;

    if (!block || !flat_number) {
        return res.status(400).json({ error: "Block and Flat Number are required" });
    }

    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM residents WHERE block = ? AND flat_number = ?",
            [block, flat_number]
        );

        if (rows.length === 0) {
            return res.json({ message: "Flat not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Filter residents dynamically by block, status, or both (case-insensitive)
router.get("/filter", async (req, res) => {
    const { block, status } = req.query;

    let query = "SELECT * FROM residents WHERE 1=1";
    const params = [];

    if (block) {
        query += " AND UPPER(block) = UPPER(?)"; // Makes block filter case-insensitive
        params.push(block);
    }

    if (status) {
        query += " AND status = ?";
        params.push(status);
    }

    query += " ORDER BY BINARY UPPER(block) ASC, flat_number ASC"; // Sort results

    try {
        const [rows] = await db.promise().query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Filter Error:", err);
        res.status(500).json({ error: err.message });
    }
});


// Fetch all residents (Reset Functionality)
router.get("/reset", async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM residents");
        res.json(rows); // Return all flats
    } catch (err) {
        console.error("Reset Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Fetch unique blocks for dropdown filter
router.get("/blocks", async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT DISTINCT block FROM residents ORDER BY block");
        res.json(rows);
    } catch (err) {
        console.error("Blocks Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});


export default router;


// import express from "express";
// import db from "../config/db.js";  

// const router = express.Router();


// router.get("/show", async (req, res) => {
//     try {
//         const [rows] = await db.promise().query("SELECT * FROM residents");
//         console.log("Fetched Residents:", rows);
//         res.json(rows);
//     } catch (err) {
//         console.error("Database Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// });


// router.post("/add", async (req, res) => {
//     const { block, flat_number, name, contact_number, email_id, status } = req.body;

//     console.log("Received data:", req.body); 

//     if (!block || !flat_number) {
//         return res.status(400).json({ message: "Block and Flat Number are required." });
//     }

//     try {
//         // Check if the flat already exists
//         const checkQuery = "SELECT * FROM residents WHERE block = ? AND flat_number = ?";
//         const [rows] = await db.promise().query(checkQuery, [block, flat_number]);

//         if (rows.length > 0) {
//             console.log("Flat already exists, not inserting."); 
//             return res.status(400).json({ error: "Flat already exists in the database." });
//         }

//         // Insert Query
//         const insertQuery = `
//             INSERT INTO residents (block, flat_number, name, contact_number, email_id, status) 
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;

//         const values = [
//             block,
//             flat_number,
//             name && name.trim() !== "" ? name : null,
//             contact_number && contact_number.trim() !== "" ? contact_number : null,
//             email_id && email_id.trim() !== "" ? email_id : null,
//             status || "vacant"
//         ];

//         console.log("Executing SQL Query:", insertQuery, values); 
//         await db.promise().query(insertQuery, values);

//         res.status(201).json({ message: "Flat/Resident added successfully!" });
//     } catch (error) {
//         console.error("Error adding flat/resident:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// // delete

// router.delete("/delete", async (req, res) => {
//     const { block, flat_number } = req.body; // 

//     if (!block || !flat_number) {
//         return res.status(400).json({ message: "Block and flat number are required." });
//     }

//     try {
//         // Check if the flat exists
//         const checkQuery = "SELECT * FROM residents WHERE block = ? AND flat_number = ?";
//         const [rows] = await db.promise().query(checkQuery, [block, flat_number]);

//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Flat not found" });
//         }

//         // Remove resident details, keep flat vacant
//         const updateQuery = `
//             UPDATE residents 
//             SET name = NULL, contact_number = NULL, email_id = NULL, status = 'vacant' 
//             WHERE block = ? AND flat_number = ?
//         `;
//         await db.promise().query(updateQuery, [block, flat_number]);

//         res.status(200).json({ message: "Resident details removed, flat set to vacant" });
//     } catch (error) {
//         console.error("Error deleting resident:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// // Search for a specific resident by Block & Flat Number
// router.get("/search", async (req, res) => {
//     const { block, flat_number } = req.query;  

//     if (!block || !flat_number) {
//         return res.status(400).json({ message: "Block and flat number are required." });
//     }

//     try {
//         const searchQuery = "SELECT * FROM residents WHERE block = ? AND flat_number = ?";
//         const [rows] = await db.promise().query(searchQuery, [block, flat_number]);

//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Flat not found" });
//         }

//         res.status(200).json(rows[0]); 
//     } catch (error) {
//         console.error("Error searching for resident:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// /*Edit Resident Route */
// router.put("/edit", async (req, res) => {
//     const { block, flat_number, name, contact_number, email_id, status } = req.body;

//     if (!block || !flat_number) {
//         return res.status(400).json({ message: "Block and flat number are required." });
//     }

//     try {
//         // Check if resident exists
//         const [rows] = await db.promise().query(
//             "SELECT * FROM residents WHERE block = ? AND flat_number = ?",
//             [block, flat_number]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ message: "No resident found for the given block and flat number." });
//         }

//         // Update resident details
//         await db.promise().query(
//             `UPDATE residents SET name = ?, contact_number = ?, email_id = ?, status = ? 
//              WHERE block = ? AND flat_number = ?`,
//             [name || null, contact_number || null, email_id || null, status || "vacant", block, flat_number]
//         );

//         res.status(200).json({ message: "Resident details updated successfully!" });
//     } catch (error) {
//         console.error("Error updating resident:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
// export default router;



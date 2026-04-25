const express = require("express");
const router = express.Router();

const Material = require("../models/Material");

/* ===============================
   GET ALL MATERIALS
================================= */
router.get("/", async (req, res) => {
  try {
    const materials =
      await Material.findAll({
        order: [["id", "DESC"]]
      });

    res.json(materials);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch materials"
    });
  }
});

/* ===============================
   ADD MATERIAL
================================= */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      subject,
      link,
      teacher
    } = req.body;

    const material =
      await Material.create({
        title,
        subject,
        link,
        teacher
      });

    res.json({
      message:
        "Material uploaded successfully",
      material
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to upload material"
    });
  }
});

/* ===============================
   DELETE MATERIAL
================================= */
router.delete("/:id", async (req, res) => {
  try {
    const material =
      await Material.findByPk(
        req.params.id
      );

    if (!material) {
      return res
        .status(404)
        .json({
          message:
            "Material not found"
        });
    }

    await material.destroy();

    res.json({
      message:
        "Material deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to delete material"
    });
  }
});

module.exports = router;
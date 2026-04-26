const router = require("express").Router();
const User = require("../models/user");

router.post("/subscribe", async (req, res) => {
  const { userId, plan, subjects } = req.body;

  const limits = { A: 4, B: 3, C: 2 };

  if (subjects.length > limits[plan]) {
    return res.status(400).json("Too many subjects");
  }

  const user = await User.findByPk(userId);

  user.subscription = { plan, active: false };
  user.subjects = subjects;

  await user.save();

  res.json("Subscription saved");
});


// ✅ ADD THIS NEW ROUTE HERE
router.post("/subjects", async (req, res) => {
  try {
    const { userId, subjects } = req.body;

    await User.update(
      { subjects: JSON.stringify(subjects) },
      { where: { id: userId } }
    );

    res.json({ message: "Subjects saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save subjects" });
  }
});

module.exports = router;
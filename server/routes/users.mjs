import express from "express";
const router = express.Router();

// Do work here

router.get('/', (req, res) => {
  res.json({ message: 'Hello User!' });
});

export default router;


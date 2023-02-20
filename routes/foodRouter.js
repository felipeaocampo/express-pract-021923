const express = require(`express`);
const path = require(`path`);

const router = express.Router();

router.get(`/`, (req, res) => {
  return res.status(200).sendFile(path.resolve(`views`, `food.html`));
});

module.exports = router;

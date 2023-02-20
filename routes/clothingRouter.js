const express = require(`express`);
const path = require(`path`);

const clothingController = require(`../controllers/clothingController`);

const router = express.Router();

router.get(`/`, clothingController.getClothingData, (req, res, next) => {
  return res.status(200).sendFile(path.resolve(`views`, `clothing.html`));
  // return res.status(200).sendFile(`Still in progress`);
});

router.get(`/:id`, clothingController.getItem, (req, res) => {
  console.log(req.params);
  return res.status(200).json(res.locals.locatedItem);
});

router.post(`/`, clothingController.postNewItem, (req, res) => {
  return res.status(200).redirect(`/clothing`);
});

router.patch(`/:id`, clothingController.editItemQuantity, (req, res) => {
  return res.status(200).json(res.locals.editedItem);
});

router.delete(`/:id`, clothingController.deleteItem, (req, res) => {
  // console.log(res.locals.deleted);
  return res.status(200).json(res.locals.deleted);
});

module.exports = router;

const fs = require(`fs`);
const path = require(`path`);

const populateClothingFromDB = (file, item) => {
  let output = file.replaceAll(`{%ID%}`, item.id);
  output = output.replaceAll(`{%ITEM%}`, item.item);
  output = output.replaceAll(`{%PRICE%}`, item.price);
  output = output.replaceAll(`{%QUANTITY%}`, item.quantity);
  return output;
};

const clothingHTML = fs.readFileSync(
  path.resolve(`views`, `clothing.html`),
  `utf-8`
);

const clothingItemTemp = fs.readFileSync(
  path.resolve(`views`, `templates`, `clothingItemTemp.html`),
  `utf-8`
);

const clothingData = JSON.parse(
  fs.readFileSync(path.resolve(`data`, `clothing-data.json`))
);

exports.getClothingData = (req, res, next) => {
  if (
    fs.readFileSync(
      path.resolve(`views`, `templates`, `clothingItemsTemp.html`),
      `utf-8`
    ) !== ``
  ) {
  } else {
    clothingData.forEach((item) => {
      // edit the item temp
      const populatedItem = populateClothingFromDB(clothingItemTemp, item);

      // each time send new iteration to clothingItemsTemp
      fs.appendFileSync(
        path.resolve(`views`, `templates`, `clothingItemsTemp.html`),
        populatedItem
      );
    });
  }

  const newClothingHTML = clothingHTML.replace(
    `{%CLOTHINGLIST%}`,
    fs.readFileSync(
      path.resolve(`views`, `templates`, `clothingItemsTemp.html`),
      `utf-8`
    )
  );

  fs.writeFileSync(path.resolve(`views`, `clothing.html`), newClothingHTML);

  next();
};

exports.getItem = (req, res, next) => {
  const { id } = req.params;
  // console.log(req.query);

  const locatedItem = clothingData.find((item) => item.id === +id);
  res.locals.locatedItem = locatedItem;

  next();
};

exports.postNewItem = (req, res, next) => {
  const { name } = req.body;
  const { price } = req.body;
  const { quantity } = req.body;

  const currentClothingData = clothingData.slice();
  // id is current length of arr
  currentClothingData.push({
    id: currentClothingData.length,
    name,
    price: +price,
    quantity: +quantity,
  });

  fs.writeFile(
    path.resolve(`data`, `clothing-data.json`),
    JSON.stringify(currentClothingData),
    (err) => {
      res.locals.newItems = currentClothingData;
      return next();
    }
  );
};

exports.editItemQuantity = (req, res, next) => {
  const { id } = req.params;
  const { quantityPurchased } = req.body;

  //find in data obj the obj matching the id
  const itemToEdit = clothingData[id];
  itemToEdit.quantity = +itemToEdit.quantity - +quantityPurchased;

  const currentClothingData = clothingData.slice();
  currentClothingData[id] = itemToEdit;

  //data used to edit item is found in body, it's json data
  fs.writeFile(
    path.resolve(`data`, `clothing-data.json`),
    JSON.stringify(currentClothingData),
    (err) => {
      res.locals.editedItem = itemToEdit;
      return next();
    }
  );
};

exports.deleteItem = (req, res, next) => {
  const { id } = req.params;

  const currentClothingData = clothingData.slice();
  const itemIndex = currentClothingData.findIndex((item) => item.id === +id);

  const deleted = currentClothingData.splice(itemIndex, 1);
  res.locals.deleted = deleted;

  fs.writeFile(
    path.resolve(`data`, `clothing-data.json`),
    JSON.stringify(currentClothingData),
    (err) => {
      // console.log(deleted);
      return next();
    }
  );
};

const express = require(`express`);
const path = require(`path`);

const clothingRouter = require(`./routes/clothingRouter`);
const foodRouter = require(`./routes/foodRouter`);

const app = express();

const PORT = 3000;

//SERVER-WIDE MIDDLEWARES
app.use(express.json());
app.use(express.static(path.resolve(`styles`)));
app.use(express.urlencoded({ extended: true }));

//ROUTING MIDDLEWARES
app.use(`/clothing`, clothingRouter);
app.use(`/food`, foodRouter);
app.get(`/`, (req, res) => {
  res.status(200).sendFile(path.resolve(`views`, "index.html"));
});

// 404, generic
app.use((req, res) => {
  console.log(`Hello from the middleware`);
  res.status(404).sendFile(path.resolve(`views`, `404.html`));
});

//ERROR CATCH HANDLER
app.use((err, req, res, next) => {
  //error handler
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred, global handler" },
  };
  Object.assign(defaultErr, err);
  console.log(defaultErr.log);
  res.status(defaultErr.status).json(defaultErr.message);
});

//SERVER
app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});

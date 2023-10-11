import path from "path";
import fs from "fs";
import express from "express";
import sharp from "sharp";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";

const app = express();
app.use(fileUpload());
app.use(express.static("public"));

app.get("/health", async (req, res) => {
    return res.status(200).send("Application health is good")
})
app.post("/upload", async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imageURL =`${__dirname}/public/images`;
  const { image } = req.files;
    console.log({image, dir:`${__dirname}/../../image-111.webp`})
  if (!image) {
    return res.status(400).send("Image not found");
  }
  const imageName = path.parse(image.name).name;
  const processImage = (size) =>
    sharp(image.data)
        .resize(size, size, {
          fit: sharp.fit.outside,
          withoutReduction: true
        })
      .webp({ lossless: true })
      .toFile(`${imageURL}/${imageName}-${size}.webp`);
  // const sizes = [96, 144, 240, 360,480, 720, 1440];
  const sizes = [ 720, 1440];
  Promise.all(sizes.map(processImage)).then(()=>console.log("complete"))
    let counter = 0;
    for (let i = 0; i < 10_000_000_000; i++) {
        counter++;
    }
    return res.status(200).send({message: "Successfully uploaded", counter})
});
app.listen(4000, ()=>{
    console.log("Server running on port 4000");
})
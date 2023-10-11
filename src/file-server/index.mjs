import express from "express";
import {Queue} from "bullmq";

import fileUpload from "express-fileupload";
import {connection, IMAGE_QUEUE_NAME, processUploadedImages} from "./utility.mjs";

const app = express();
app.use(fileUpload());
app.use(express.static("public"));

const imageJobQueue = new Queue(IMAGE_QUEUE_NAME, {connection});
async function addJob(job) {
  await imageJobQueue.add(job.type, job, {jobId: job.image.name} );
}

app.get("/health", async (req, res) => {
  return res.status(200).send("Application health is good");
});

app.post("/upload-bmq", async (req, res) => {
  const { image } = req.files;
  if (!image) {
    return res.status(400).send("Image not found");
  }
  // const imageName = path.parse(job.image.name).name;
  await addJob({
    type: "processUploadedImages",
    image: {
      data: image.data.toString("base64"),
      name: image.name,
    },
  });
  return res.status(200).send({ message: "Successfully uploaded" });
});
app.post("/upload", async (req, res) => {
  const { image } = req.files;
  if (!image) {
    return res.status(400).send("Image not found");
  }
  await processUploadedImages(image);
  return res.status(200).send({ message: "Successfully uploaded" });
});
app.listen(4000, () => {
  console.log("Server running on port 4000");
});

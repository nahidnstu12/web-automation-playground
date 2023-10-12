import {connection, IMAGE_QUEUE_NAME, processUploadedImages} from "./utility.mjs";
import {Worker} from "bullmq"

export const workerHandler = (job) => {
    console.log("Starting job:", job.name);
    processUploadedImages(job.data);
    console.log("Finished job:", job.name);
};

new Worker(IMAGE_QUEUE_NAME, workerHandler, {connection});

console.log("Worker started!");
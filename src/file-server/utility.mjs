import Redis from "ioredis";
import {fileURLToPath} from "url";
import path from "path";
import sharp from "sharp";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageURL =`${__dirname}/public/images`;

export const IMAGE_QUEUE_NAME = "imageJobQueue"
export const processUploadedImages = (job) =>{
    let counter = 0;
    const imageFileData = Buffer.from(job.image.data, "base64");
    const imageName = path.parse(job.image.name).name;

    const processImage = (size) =>
        sharp(imageFileData)
            .resize(size, size, {
                fit: sharp.fit.outside,
                withoutReduction: true
            })
            .webp({ lossless: true })
            .toFile(`${imageURL}/${imageName}-${size}.webp`);
    // const sizes = [96, 144, 240, 360,480, 720, 1440];
    const sizes = [ 720, 1440];
    Promise.all(sizes.map(processImage)).then(()=>console.log("complete", {counter}))

    for (let i = 0; i < 10_000_000_000; i++) {
        counter++;
    }

}

export const connection = new Redis(process.env.REDIS_PATH, {
    maxRetriesPerRequest: null,
});
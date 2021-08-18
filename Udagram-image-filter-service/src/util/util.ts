import fs from 'fs';
import path from 'path';
import Jimp = require('jimp');
import Axios from 'axios';
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const generatedImageName = 'filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            // const folder = 'tmp';
            const file = await downloadFile(inputURL, __dirname, generatedImageName);
            const photo = await Jimp.read(file);
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(path.join(__dirname, generatedImageName), (img) => {
                    resolve(path.join(__dirname, generatedImageName));
                });

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

// Get image from url and save to local folder.
// url is the image address, for example, http://wximg.233.com/attached/image/20160815/20160815162505_0878.png
// filepath is the local directory for file downloads
// name is the file name after downloading
async function downloadFile(url: string, filePath: string, fileName: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    const mypath = path.resolve(filePath, fileName);
    const writer = fs.createWriteStream(mypath);
    const response = await Axios({
        url,
        method: "GET",
        responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    }).then((err) => {
        if (err) console.log(err);
        return mypath;
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}

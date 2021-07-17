import fs from 'fs';
import path from 'path';
import Jimp = require('jimp');
import fetch from 'node-fetch';
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
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            const file = await download(inputURL, outpath);
            const photo = await Jimp.read(file);
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(path.join(__dirname, outpath), (img) => {
                    resolve(path.join(__dirname, outpath));
                });

        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
}

// Get image from url and save to local folder.
async function download(url: string, outpath: string) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(path.join(__dirname, outpath), buffer, () =>
        console.log('finished downloading!'));
    return path.join(__dirname, outpath);
}
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
    for (let file of files) {
        console.log("for each " + file);
        fs.unlinkSync(file);
    }
}
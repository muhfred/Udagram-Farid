import fs from 'fs';
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
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        const file = await download(inputURL, outpath);
        Jimp.read(file)
            .then(photo => {
                photo
                    .resize(256, 256) // resize
                    .quality(60) // set JPEG quality
                    .greyscale() // set greyscale
                    .write(__dirname + outpath, (img) => {
                        resolve(__dirname + outpath);
                    });
            }).catch(err => {
                console.error(err);
                reject("Could not read image.");
            });
    });
}

// Get image from url and save to local folder.
async function download(url: string, outpath: string) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(__dirname + outpath, buffer, () =>
        console.log('finished downloading!'));
    return __dirname + outpath;
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
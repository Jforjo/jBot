import { readFile } from 'fs/promises';
import { join } from 'path';

export default async (req, res) => {
    // GETTING THE IMAGES FROM FOLDER
    // const files = await readdir(join(__dirname, 'images'));
    // const filename = files[Math.floor(Math.random() * files.length)];
    // const image = await readFile(join(__dirname, 'images', filename));
    // const ext = extname(filename);
    // const type = ext === '.png' ? 'image/png' : ext === '.jpg' ? 'image/jpeg' : ext === '.gif' ? 'image/gif' : 'image/svg+xml';
    // res.setHeader('Content-Type', type);
    // res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    // res.send(image);

    // return res.status(200).send(image);

    // GETTING IMAGE URLS FROM TXT FILE
    const urls = await readFile(join(process.cwd(), 'urls.txt'), 'utf8').then((data) => data.split('\n'));
    // Promise.all(urls.map((url) => isImgUrl(url))).then(console.log); // [true, true ,true]
    const image = await await Promise.all(urls.map(async (url) => {
        const urlState = await isImgUrl(url);
        if (urlState.isImg) return { url: url, type: urlState.type };
    })).then(arr => arr[Math.floor(Math.random() * arr.length)]);
    res.setHeader('Content-Type', image.type);
    res.setHeader('Content-Disposition', `attachment; filename=image.${image.type.replace('image/', '')}`);
    // res.send(await readFile(image.url));
    res.send(await (await fetch(image.url)).buffer());
};
async function isImgUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        const type = res.headers.get('Content-Type');
        return {
            isImg: type && type.startsWith('image'),
            type: type,
            url: url
        };
    } catch {
        return { isImg: false };
    }
}

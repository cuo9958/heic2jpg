const convert = require('heic-convert');
const compressing = require('compressing');
const fs = require('fs');
const path = require('path');

// 解压图片
function unzip(src, dist) {
    return compressing.zip.uncompress(src, dist);
}
// 图片格式转换
async function heic2jpg(src, dist, name) {
    const buf = fs.readFileSync(src);
    const outputBuffer = await convert({
        buffer: buf,
        format: 'JPEG',
        quality: 1,
    });
    fs.writeFileSync(path.join(dist, name + '.jpg'), outputBuffer);
}

// 将src目录下的内容输出到另外一个目录
async function convertLivp(src, dist) {
    if (!dist) dist = src;
    const list = fs.readdirSync(src);
    const temp = path.join(src, '.temp');
    for (let index = 0; index < list.length; index++) {
        const filename = list[index];
        const ext = path.extname(filename);
        if (ext === '.livp') {
            await unzip(path.join(src, filename), temp);
        }
    }
    return convertHeic(temp, dist);
}

// 将src目录下的内容都格式转换一次
async function convertHeic(src, dist) {
    if (!dist) dist = src;
    const list = fs.readdirSync(src);
    for (let index = 0; index < list.length; index++) {
        const filename = list[index];
        const ext = path.extname(filename);
        if (ext === '.heic') {
            await heic2jpg(path.join(src, filename), dist, filename.split('.heic')[0]);
        }
    }
}

module.exports = {
    convertLivp,
    convertHeic,
    unzip,
    heic2jpg,
};

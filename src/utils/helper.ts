import { QualityMeasurement } from '@/models/enum/common';

export const datetimeMixin = {
    filters: {
        timestampToDate(timestamp: number) {
            if (!timestamp) {
                return '---';
            }
            timestamp = timestamp * 1000 + timezone * 60 * 60 * 1000;
            // 加上時區
            const webTime = new Date(timestamp);
            // Date
            const iso = webTime
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, '-');
            return iso;
        },
        timestampToDatetime(timestamp: number) {
            if (!timestamp) {
                return '---';
            }
            timestamp = timestamp * 1000 + timezone * 60 * 60 * 1000;
            // 加上時區
            const webTime = new Date(timestamp);
            // Time 這裡用UTC取得已經轉換過的時間
            // const time = webTime;
            const hours = webTime.getUTCHours() < 10 ? `0${webTime.getUTCHours()}` : webTime.getUTCHours();
            const minutes = `0${webTime.getUTCMinutes()}`;
            const seconds = `0${webTime.getUTCSeconds()}`;
            return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
        },
        timestampToDateAndTime(timestamp: number) {
            if (!timestamp) {
                return '---';
            }
            timestamp = timestamp * 1000 + timezone * 60 * 60 * 1000;
            // 加上時區
            const webTime = new Date(timestamp);
            // Date
            const iso = webTime
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, '-');
            // Time 這裡用UTC取得已經轉換過的時間
            const hours = webTime.getUTCHours() < 10 ? `0${webTime.getUTCHours()}` : webTime.getUTCHours();
            const minutes = `0${webTime.getUTCMinutes()}`;
            const seconds = `0${webTime.getUTCSeconds()}`;
            return `${iso} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
        },
    },
};

export const titleMixin = {
    filters: {
        limitTitle(title: string) {
            return title.substr(0, 20) + (title.length > 20 ? "..." : "")
        }
    }
}

/**
 * 站台timezone
 * for filter timestamp to string
 */
export const timezone = 8;

/**
 * yyyy-mm-dd 轉換成TimeStamp
 */
export const dateToTimeStamp = (date: string) => {
    return new Date(date).getTime() / 1000;
};

/**
 * yyyy-mm-dd + 1天 轉換成TimeStamp
 */
export const endDateToTimeStamp = (date: string) => {
    return new Date(date).getTime() / 1000 + (86400 - 1);
};

/**
 * 取得前幾天的日期 yyyy-mm-dd
 * @parameter 傳入7可取得前7天的時間戳
 */
export const daysAgo = (day: number) => {
    const newDate = new Date(new Date().getTime() - day * 24 * 60 * 60 * 1000);
    return newDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '-');
};

export const arrConditions = [
    QualityMeasurement.Broken,
    QualityMeasurement.Poor,
    QualityMeasurement.DailyUsed,
    QualityMeasurement.RarelyUsed,
    QualityMeasurement.AlmostLikeNew,
    QualityMeasurement.New
]

export const brokenImg = require("@/assets/broken-img.png")

//return blob and dataurl
export const resizeImage = (files: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement("canvas");
        img.onload = () => {
            try {
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext("2d");
                ctx!.drawImage(img, 0, 0, width, height);
                let dataurl = canvas.toDataURL("image/png");
                resolve(dataurl);
            } catch (error) {
                reject(error);
            }
        };
        const fr = new FileReader();
        fr.readAsDataURL(files);
        fr.addEventListener("load", () => {
            img.src = fr.result || brokenImg;
        });
    });
}

export const dataUrlToBlob = (dataurl: string) => {
    // Split the base64 string in data and contentType
    const block = dataurl.split(";");
    // Get the content type of the image
    const contentType = block[0].split(":")[1];
    // get the real base64 content of the file
    const realData = block[1].split(",")[1];
    // Convert it to a blob to upload
    const blob = b64toBlob(realData, contentType);
    return blob;
}

const b64toBlob = (b64Data: string, contentType: string = "", sliceSize: number = 512) => {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
    ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
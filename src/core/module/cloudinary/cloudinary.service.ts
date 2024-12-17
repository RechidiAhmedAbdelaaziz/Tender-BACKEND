import { HttpException, Injectable, } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,

        });
    }

    uploadImage = async (file: Express.Multer.File, options: {
        name: string,
        folder: string,
    }) => {
        const { name, folder } = options;
        const result = await cloudinary.uploader
            .upload(
                file.path,
                {
                    folder: 'TENDER/' + folder,
                    public_id: name,
                    overwrite: true,
                }
            )
            .catch((error) => {
                throw new HttpException(error, 500)
            });

        console.log('result', result);
        return result.secure_url;

    }

    uploadMultiple = async (
        files?:
            {
                file: Express.Multer.File,
                options: {
                    name: string,
                    folder: string,
                }
            }[]
    ) => {
        const promises = files?.map(async (file) => {
            return await this.uploadImage(file.file, file.options);
        });

        return await Promise.all(promises);
    }

    deleteImage = async (publicId: string) => {
        await cloudinary.uploader
            .destroy(publicId)
            .catch((error) => {
                throw new HttpException(error, 500)
            });
    }
}
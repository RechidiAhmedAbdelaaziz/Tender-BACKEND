import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

const multerMdule = MulterModule.register({
    dest: './upload',
});

@Module({
    imports: [multerMdule],
    providers: [CloudinaryService],
    exports: [CloudinaryService, multerMdule],

})
export class CloudinaryModule { }
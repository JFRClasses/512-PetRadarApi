import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
    private readonly s3Client = new S3Client({ region: 'us-east-1' });

    async uploadFile(file:any, folder:string){
        const filePath = `${folder}/${randomUUID()}`;
        const bucket = '512-jfr-pet-radar-images-s3';
        const region = 'us-east-1';
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype
            })
        );
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`
        return url;
    }
}

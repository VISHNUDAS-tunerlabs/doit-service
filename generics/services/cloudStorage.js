/**
 * name : files.js
 * author : Vishnu
 * created-date : 01-Sep-2023
 * Description :  Cloud storage service.
*/

const path = require('path')

const { AwsFileHelper, AzureFileHelper, GcpFileHelper,OciFileHelper } = require('elevate-cloud-storage')

module.exports = class FilesHelper {
	static async getGcpSignedUrl(destFilePath, actionType = 'write') {
		const bucketName = process.env.DEFAULT_GCP_BUCKET_NAME
		const options = {
			destFilePath: destFilePath, // Stored file path - location from bucket - example - users/abc.png
			bucketName: bucketName, // google cloud storage bucket in which action is peformed over file
			actionType: actionType, // signed url usage type - example ('read' | 'write' | 'delete' | 'resumable')
			expiry: Date.now() + 1000 * 60 * 30, // signed url expiration time - In ms from current time - type number | string | Date
			gcpProjectId: process.env.GCP_PROJECT_ID, // google cloud storage project id
			gcpJsonFilePath: path.join(__dirname, '../', process.env.GCP_PATH), // google cloud storage json configuration file absolute path for connectivity
			contentType: 'multipart/form-data', // content type of file, example multipart/form-data, image/png, csv/text etc
		}

		try {
			const signedUrl = await GcpFileHelper.getSignedUrl(options)
			return signedUrl
		} catch (error) {
			throw error
		}
	}

	static async getAwsSignedUrl(destFilePath, actionType = 'putObject') {
		const bucketName = process.env.DEFAULT_AWS_BUCKET_NAME
		const options = {
			destFilePath: destFilePath, // Stored file path - i.e location from bucket - ex - users/abc.png
			bucketName: bucketName, // aws s3 storage bucket in which action is peformed over file
			actionType: actionType, // signed url usage type - example ('putObject' | 'getObject')
			expiry: 30 * 60, // signed url expiration time - In sec - type number
			accessKeyId: process.env.AWS_ACCESS_KEY_ID, // aws s3 access key id
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // aws s3 secret access key
			bucketRegion: process.env.AWS_BUCKET_REGION, // aws region where bucket will be located, example - 'ap-south-1'
		}

		try {
			let signedUrl = await AwsFileHelper.getSignedUrl(options)
			return signedUrl
		} catch (error) {
			throw error
		}
	}

	static async getAzureSignedUrl(destFilePath) {
		const containerName = process.env.DEFAULT_AZURE_CONTAINER_NAME

		const startDate = new Date()
		const expiryDate = new Date(startDate)
		expiryDate.setMinutes(startDate.getMinutes() + 30)

		const options = {
			destFilePath: destFilePath, // Stored file path - i.e location from container - ex - users/abc.png
			containerName: containerName, // container in which file gets saved
			expiry: 30, // signed url expiration time - In minute - type number
			actionType: 'w', // signed url usage type - example ('w' | 'r' | 'wr' | 'racwdl') - pair of any alphabets among racwdl
			accountName: process.env.AZURE_ACCOUNT_NAME, // account name of azure storage
			accountKey: process.env.AZURE_ACCOUNT_KEY, // account key of azure storage
			contentType: 'multipart/form-data', // content type of file, example multipart/form-data, image/png, csv/text etc
		}

		try {
			const signedUrl = await AzureFileHelper.getSignedUrl(options)
			return signedUrl
		} catch (error) {
			throw error
		}
	}

	static async getOciSignedUrl(destFilePath, actionType = 'putObject') {
		const bucketName = process.env.DEFAULT_OCI_BUCKET_NAME
		const options = {
			destFilePath: destFilePath, // Stored file path - i.e location from bucket - ex - users/abc.png
			bucketName: bucketName, // Oci storage bucket in which action is peformed over file
			actionType: actionType, // signed url usage type - example ('putObject' | 'getObject')
			expiry: 30 * 60, // signed url expiration time - In sec - type number
			accessKeyId: process.env.OCI_ACCESS_KEY_ID, // Oci access key id
			secretAccessKey: process.env.OCI_SECRET_ACCESS_KEY, // Oci secret access key
			bucketRegion: process.env.OCI_BUCKET_REGION, // Oci region where bucket will be located, example - 'ap-south-1'
			endpoint: process.env.OCI_BUCKET_ENDPOINT,
		}

		try {
			let signedUrl = await OciFileHelper.getSignedUrl(options)
			return signedUrl
		} catch (error) {
			throw error
		}
	}

    static async getDownloadableUrl(imgPath) {
        let options = {};
      
        switch (process.env.CLOUD_STORAGE) {
          case 'GC':
            options = {
              destFilePath: imgPath,
              bucketName: process.env.DEFAULT_GCP_BUCKET_NAME,
              gcpProjectId: process.env.GCP_PROJECT_ID,
              gcpJsonFilePath: path.join(__dirname, '../', process.env.GCP_PATH),
            };
            imgPath = await GcpFileHelper.getDownloadableUrl(options);
            break;
      
          case 'AWS':
            options = {
              destFilePath: imgPath,
              bucketName: process.env.DEFAULT_AWS_BUCKET_NAME,
              bucketRegion: process.env.AWS_BUCKET_REGION,
            };
            imgPath = await AwsFileHelper.getDownloadableUrl(options.destFilePath, options.bucketName, options.bucketRegion);
            break;
      
          case 'AZURE':
            options = {
              destFilePath: imgPath,
              containerName: process.env.DEFAULT_AZURE_CONTAINER_NAME,
              expiry: 30,
              actionType: 'rw',
              accountName: process.env.AZURE_ACCOUNT_NAME,
              accountKey: process.env.AZURE_ACCOUNT_KEY,
            };
            imgPath = await AzureFileHelper.getDownloadableUrl(options);
            break;
      
          case 'OCI':
            options = {
              destFilePath: imgPath,
              bucketName: process.env.DEFAULT_OCI_BUCKET_NAME,
              endpoint: process.env.OCI_BUCKET_ENDPOINT,
            };
            imgPath = await OciFileHelper.getDownloadableUrl(options);
            break;
      
          default:
            // Handle the case where process.env.CLOUD_STORAGE is not recognized
            throw new Error('Unknown cloud storage provider');
        }
      
        return imgPath;
      }
      
}

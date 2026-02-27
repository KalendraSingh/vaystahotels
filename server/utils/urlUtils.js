/**
 * Convert S3 URL to CloudFront URL.
 * @param {string} s3Url - The S3 URL of the uploaded file.
 * @returns {string} - The corresponding CloudFront URL.
 */
export const convertS3ToCloudFrontUrl = (s3Url) => {
	if (!s3Url) return null; // Return null if the input is invalid
	return s3Url.replace(
		process.env.AWS_S3_BUCKET_URL, // Example: 'https://your-bucket.s3.amazonaws.com'
		process.env.AWS_CLOUDFRONT_URL, // Example: 'https://your-cloudfront-id.cloudfront.net'
	);
};

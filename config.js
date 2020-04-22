module.exports = {
    mongoURL: process.env.MONGODB_URL,
    secret:process.env.JWT_SECRET,
    CLOUDINARY_URL: "",
    STRIPE_SECRET_KEY: "",
    awsID: process.env.AWS_ID,
     awsSecret: process.env.AWS_SECRET,
     awsBucket: process.env.AWS_BUCKET_NAME,
     email:process.env.EMAIL,
     pass:process.env.PASS,
     //Twilio
     serviceID:process.env.serviceID,
     accountSID:process.env.accountSID,
     authToken:process.env.authToken
}

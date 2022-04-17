export interface IOtp {
    _id:String;
    otp: String;
    expiration_time:Date;
    verified:Boolean;
}
export interface IOtpDTO{
      timestamp: String, 
      check: String,
      success: String,
      message:"OTP sent to user",
      otp_id: String
}
export interface IOtpInput{
    verificationKey:String;
    otp:String;
    check:String;
}
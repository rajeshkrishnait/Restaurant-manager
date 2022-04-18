import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import { IOtpDTO, IOtpInput} from '@/interfaces/IOtp';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { EnvironmentCredentials } from 'aws-sdk';


const router = require("express").Router();
const {encode,decode} = require("../api/middlewares/crypt")
var otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
var dates = {
  convert:function(d) {
    return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0],d[1],d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year,d.month,d.date) :
        NaN
    );
},
  compare:function(a,b) {
      return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
      );
  },
  inRange:function(d,start,end) {
     return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
      );
  }
}
@Service()
export default class OtpService {
  constructor(
    @Inject('otpModel') private otpModel: Models.OtpModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async SendOtpByMail(email: String):Promise<{otpDetails:IOtpDTO}>{
    try {
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);
    
  
    const otp_instance = await this.otpModel.create({
      otp: otp,
      expiration_time: expiration_time
    });

    var details={
      "timestamp": now, 
      "check": email,
      "success": true,
      "message":"OTP sent to user",
      "otp_id": otp_instance.id
    }

    const otpDetails= await encode(JSON.stringify(details))
    
      
    const {message, subject_mail} = require('../templates/email/email_2FA');
    const email_message=message(otp)
    const email_subject=subject_mail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587 ,
      secure: false,
      ssl: true,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      }
    });


    const mailOptions = {
      from: `"Rajesh Krishna"<${process.env.EMAIL_ADDRESS}>`,
      to: `${email}`,
      subject: email_subject,
      text: email_message ,
    };
    await transporter.verify();
    let status = "failure"

     transporter.sendMail(mailOptions, (err, response) => {
      
      console.log(response)
      console.log("err")
    });
    return {otpDetails};
  } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async verifyOtp(otpInput:IOtpInput):Promise<{status:boolean;token:String}>{
    try{
      var currentdate = new Date(); 
      let decoded;
      try{

        decoded = await decode(otpInput.verificationKey)

      }
      catch(err) {
        throw new Error("bad request")
      }
      
      var obj= JSON.parse(decoded)
      console.log(obj)
      const check_obj = obj.check
      // Check if the OTP was meant for the same email or phone number for which it is being verified 
      if(check_obj!=otpInput.check){
        throw new Error("OTP was not sent to this particular email or phone number")
      }
  
      const otp_instance= await this.otpModel.findById(obj.otp_id)
      console.log(otp_instance)
      //Check if OTP is available in the DB
      if(otp_instance!=null){
        //Check if OTP is already used or not
        if(otp_instance.verified!=true){
  
            //Check if OTP is expired or not
            if (dates.compare(otp_instance.expiration_time, currentdate)==1){
  
                //Check if OTP is equal to the OTP in the DB
                if(otpInput.otp===otp_instance.otp){
                    // Mark OTP as verified or used
                    otp_instance.verified=true
                    otp_instance.save()
                    const token = await this.generateToken(otpInput.check)
                    return {status:true, token}
                }
                else{
                    throw new Error("OTP Not Matched")
                }   
            }
            else{
                throw new Error("OTP expired")
            }
        }
        else{
            throw new Error("OTP Already used")
          }
        }
      else{
          throw new Error("Bad Request")
        }
    }catch(err){
        throw new Error(err)

    }
  }
  private generateToken(email) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    
    return jwt.sign(
      {
        email:email,
        role:"Customer"
      },
      config.jwtSecret,
      {
        expiresIn:'12h'
      },
    );
  }
}
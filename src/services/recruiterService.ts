import { Repository } from "../repository/recruiterRepository";
import { generateOTP } from "../utils/generateotp";
import { emailVerification } from "../utils/sendmail";
import dotenv from "dotenv";
dotenv.config();

interface User{
    username:string;
    email:string;
    mobile:string;
    companyName:string;
    companyEmail:string;
    password:string; 
}
interface Login {
    email: string;
    password:string; 
}
export const service={
    register:async(userdata:User)=>{
        try{console.log('service',userdata);
        const email=userdata.email
        if (email == undefined) {
            throw new Error("Email is undefined");
        }
        const emailExist= await Repository.findByEmail(email);
        if(emailExist){
            return { success: false, message: "Email already exists" };
        }
        let otp=generateOTP()
            console.log(otp,email);
            
            await emailVerification(email,otp)
            console.log('email sended');
            return { success: true, message: "Verification email sent",otp:otp,user_data:userdata };
    }catch(err){
        console.log("ERROR:",err);
        
    }
    },
    verifyOtp:async(enterOtp:string,otp:string,userdata:User)=>{
        try{
            console.log(otp,'serviceotp');
            
            if(otp==enterOtp){
                console.log(userdata,'enkwenadk');
                
                const usercreated = await Repository.createUser(userdata);
                return { success: true, message: 'Correct OTP' };

            }else {
      
      return { success: false, message: 'Invalid OTP' };
    }

        }catch(error){
            throw new Error(`Failed to sign up: ${error}`);
        }
    },
    verifyLogin:async(userdata:Login)=>{
        try{
            const loginResponse=await Repository.validateUser(userdata)
            console.log(loginResponse);
            return {success:loginResponse}
        }catch(err){
            throw new Error(`Failed to sign up: ${err}`);   
        }
    },

}

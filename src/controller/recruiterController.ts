import { Request } from "express";
import { service } from "../services/recruiterService";
import {Repository} from '../repository/recruiterRepository'



export const recuiterController={
    signup:async(call:any,callback:any)=>{
        try{
            console.log('came cotrolelrfor singup',call.request);
            const data=call.request
            const response =await service.register(data)
            if (response?.success) {
                console.log("if",response.user_data);
                callback(null, { success: true, msg: "otp sended",otp:response.otp,data:response.user_data });
              } else {
                callback(null, { success: false, msg: "email already exist" });
              }
        }catch(err){
            console.log("ERROR:",err,);
            
        }
    },
    otp: async (call:any,callback:any) => {
        try {
          const body = call.request;
          console.log("Redwequest Body:", body);
          const otp = body.otp;
          console.log("OTP from cookie:", otp);
          const userdata = body.userdata;
          console.log("Cookie from user data:", userdata);
          const enterOtp = body.enterOtp;
          console.log("User enter otp:", enterOtp); 
          const otpResponse = await service.verifyOtp(enterOtp,otp,userdata);
          console.log(otpResponse, 'otpresponse');
          callback(null, otpResponse); 
        } catch (err) {
          callback(err);
        }
      },
      login:async(call: any, callback: any)=>{
        try{
        console.log('login service cotroller',call.request);
        const email=call.request.email;
        const password=call.request.password
    console.log(email,password,'login controler');
    
        // const userdata=call.Request
        const userdata={
          email,
          password
        }
        console.log('userdata',userdata);
        const loginResponse=await service.verifyLogin(userdata)
        console.log(loginResponse,'in controller');
        callback (null,loginResponse)
        }catch (err) {
          callback(err);
        } 
      },
      getall:async(call:any,callback:any)=>{
        try{
          console.log('get controlerr');
          let users=await Repository.getall()
          console.log(users,'uuu');
          const response = {
            users: users 
        };
          callback(null,response)
        }catch(err){
          callback(err);
        }
      },
      updateStatus:async(call:any,callback:any)=>{
        try{
          console.log('get controlerrstatus upadte');
          let user=await Repository.findByEmail(call.request.email)
          let update,users;
      
          if(user){
         update = await Repository.updateStatus( user );
          }
          if(update){
         users=await Repository.getall()
          }
          console.log(user,'uuu');
          const response = {
            users: users 
        };
          callback(null,response)
        }catch(err){
          callback(err);
        }
      },
      updateApproval:async(call:any,callback:any)=>{
        try{
          console.log('get controlerrstatus upadte');
          let user=await Repository.findByEmail(call.request.email)
          let update,users;
      
          if(user){
         update = await Repository.updateApprove( user );
          }
          if(update){
         users=await Repository.getall()
          }
          console.log(user,'uuu');
          const response = {
            users: users 
        };
          callback(null,response)
        }catch(err){
          callback(err);
        }
      },
      
}

import RecuiterModel,{Recuiter} from "../model/recruiterModel";
import bcrypt from "bcryptjs";

interface Login {
    email: string;
    password:string; 
}
interface Recruiter {
    username: string;
    email: string;
    mobile:string
    password:string;
    isActive?:boolean;
    status:boolean;
    companyName:string;
    companyemail:string;
   
}
export const Repository={
    findByEmail:async(email:string): Promise<Recuiter| null>=>{
        try{
            const user=await RecuiterModel.findOne({email})
            console.log('rep');
            return user
        }catch(err){
            console.error(`Error finding user by email: ${err}`);
            return null;
        }
    },
    createUser:async(userdata:Partial<Recuiter>)=>{
        try{
            console.log(userdata,'reposuserdata',userdata.email,userdata.password,typeof(userdata));
            const latestdata=userdata
            console.log(latestdata,'latseeetetet',typeof(userdata));
            
            let created=await RecuiterModel.create({
                username: userdata.username,
                email: userdata.email,
                mobile: userdata.mobile,
                password: userdata.password,
                companyName:userdata.companyName,
                companyemail:userdata.companyemail,
            });
            console.log('createdresult',created);
            await created.save()
            return true
        }catch(err){
            console.log('Error',err);
            
        }
    },
    validateUser:async(userdata:Login)=>{
        try{
            const user=await RecuiterModel.findOne({email:userdata.email});
            console.log(user);
            
            if(user){
                console.log(userdata.password);
                const passwordvalue=await bcrypt.compare(userdata.password, user.password);
                // let passwordvalue=userdata.password==user.password
                console.log(passwordvalue,'pass');
                if(passwordvalue){
                    return true
                }
            }
            return false
        }catch(err){
            console.log('error',err);
            
        }
    },
    getall:async()=>{
        try{
const users=await RecuiterModel.find({},
    {'_id':1,'username':1,'email':1,'mobile':1,'isActive':1,'status':1,'companyName':1,'companyemail':1})
console.log('users',users);
return users
        }catch(err){
            console.error(`Error on getting all user: ${err}`);
            return null;
        }
    },
    updateStatus:async(User:Recruiter)=>{
        try{
            console.log(User.email,'ww');
            
const user=await RecuiterModel.updateOne({email:User.email},{$set:{isActive:!User.isActive}})
console.log('user',user);
return true
        }catch(err){
            console.error(`Error on getting all user: ${err}`);
            return null;
        }
    },
    updateApprove:async(User:Recruiter)=>{
        try{
            console.log(User.email,'ww');
            
const user=await RecuiterModel.updateOne({email:User.email},{$set:{status:true}})
console.log('user',user);
return true
        }catch(err){
            console.error(`Error on getting all user: ${err}`);
            return null;
        }
    },
}

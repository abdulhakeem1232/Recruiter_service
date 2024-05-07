import RecuiterModel,{Recuiter} from "../model/recruiterModel";
import bcrypt from "bcryptjs";

interface Login {
    email: string;
    password:string; 
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
    }
}

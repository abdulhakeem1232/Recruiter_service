import mongoose,{Document,Schema} from "mongoose";
import bcrypt from 'bcryptjs'

export interface Recuiter extends Document{
    username:string;
    email:string;
    mobile:string;
    companyName:string;
    avatar?:string;
    password:string;
    companyemail:string;
    status:boolean;
    isActive:boolean;
    matchPassword: (enteredPassword: string) => Promise<boolean>
}

const RecuiterSchema :Schema<Recuiter>=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
    },
    companyName:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:false
    },
    companyemail:{
        type:String,
    },
    password:{
        type:String,
       required:true 
    },
    status:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
})

//pre-save password
RecuiterSchema.pre<Recuiter>('save',async function (next) {
    if (!this.isModified("password")) {
        return next();
      }
    
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt); 
      next();
    });

    RecuiterSchema.methods.matchPassword=async function(eneteredpassword:string){
    return await bcrypt.compare(eneteredpassword,this.password)
}
const RecuiterModel = mongoose.model<Recuiter>("Recuiter", RecuiterSchema);

export default RecuiterModel;

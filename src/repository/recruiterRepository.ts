import RecuiterModel, { Recuiter } from "../model/recruiterModel";
import bcrypt from "bcryptjs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'

dotenv.config()

const access_key = process.env.ACCESS_KEY
const secret_access_key = process.env.SECRET_ACCESS_KEY
const bucket_name = process.env.BUCKET_NAME

const s3: S3Client = new S3Client({
    credentials: {
        accessKeyId: access_key || '',
        secretAccessKey: secret_access_key || ''
    },
    region: process.env.BUCKET_REGION
});

interface Login {
    email: string;
    password: string;
}
interface Recruiter {
    username: string;
    email: string;
    mobile: string
    password: string;
    isActive?: boolean;
    status: boolean;
    companyName: string;
    companyemail: string;

}
export const Repository = {
    findByEmail: async (email: string): Promise<Recuiter | null> => {
        try {
            const user = await RecuiterModel.findOne({ email })
            return user
        } catch (err) {
            console.error(`Error finding user by email: ${err}`);
            return null;
        }
    },

    createUser: async (userdata: Partial<Recuiter>) => {
        try {
            const latestdata = userdata
            let created = await RecuiterModel.create({
                username: userdata.username,
                email: userdata.email,
                mobile: userdata.mobile,
                password: userdata.password,
                companyName: userdata.companyName,
                companyemail: userdata.companyemail,
            });
            await created.save()
            const getObjectParams = {
                Bucket: bucket_name,
                Key: created?.avatar,
            }
            const getObjectCommand = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
            if (created) {
                created.avatar = url
            }
            return { success: true, user: created }
        } catch (err) {
            console.log('Error', err);

        }
    },

    validateUser: async (userdata: Login) => {
        try {
            const user = await RecuiterModel.findOne({ email: userdata.email });
            console.log(user);
            if (user?.isActive == false) return { success: false, message: "You are Blocked" }
            console.log(user);
            if (user?.status == false) return { success: false, message: "You are Not Verified" }

            if (user) {
                console.log(userdata.password);
                const passwordvalue = await bcrypt.compare(userdata.password, user.password);
                const getObjectParams = {
                    Bucket: bucket_name,
                    Key: user?.avatar,
                }
                const getObjectCommand = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
                if (user) {
                    user.avatar = url
                }
                if (passwordvalue) {
                    return { success: true, user: user }
                }
            }
            return false
        } catch (err) {
            console.log('error', err);
        }
    },

    getall: async () => {
        try {
            const users = await RecuiterModel.find({},
                { '_id': 1, 'username': 1, 'email': 1, 'mobile': 1, 'isActive': 1, 'status': 1, 'companyName': 1, 'companyemail': 1 })
            return users
        } catch (err) {
            console.error(`Error on getting all user: ${err}`);
            return null;
        }
    },

    updateStatus: async (User: Recruiter) => {
        try {
            const user = await RecuiterModel.updateOne({ email: User.email }, { $set: { isActive: !User.isActive } })
            return true
        } catch (err) {
            console.error(`Error on getting all user: ${err}`);
            return null;
        }
    },

    updateApprove: async (User: Recruiter) => {
        try {
            const user = await RecuiterModel.updateOne({ email: User.email }, { $set: { status: true } })
            return true
        } catch (err) {
            console.error(`Error on getting all user: ${err}`);
            return null;
        }
    },

    getStatus: async (userId: string) => {
        try {
            let user = await RecuiterModel.findOne({ _id: userId })
            let status = user?.isActive
            return { status }
        } catch (err) {
            console.error(`Error on getting user status: ${err}`);
            return null;
        }
    },

    getChartDetails: async (currentYear: number, month: number) => {
        try {
            const userStats = await RecuiterModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [{ $year: "$createdAt" }, currentYear]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.month": 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        count: 1
                    }
                }

            ])
            const result = Array.from({ length: month + 1 }, (_, i) => ({
                month: i + 1,
                count: 0
            }));
            userStats.forEach(stat => {
                const index = result.findIndex(r => r.month == stat.month);
                if (index !== -1) {
                    result[index].count = stat.count;
                }
            });
            let count = await RecuiterModel.find().countDocuments();
            return { result, count }
        } catch (err) {
            console.error(`Error fetching chart: ${err}`);
            return null;
        }
    },

}

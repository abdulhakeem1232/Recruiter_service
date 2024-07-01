import dotenv from 'dotenv'
import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { connectDB } from './config/db';
import { recuiterController } from './controller/recruiterController';

dotenv.config()
connectDB()

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "proto/recruiter.proto"))
const recruiterProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server();

const grpcServer = () => {
  server.bindAsync(
    `0.0.0.0:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.log(err, "error happened grpc user service");
        return;
      }
      console.log("grpc user server started on port:", port);
    }
  );
};

server.addService(recruiterProto.RecuiterServices.service, {
  Register: recuiterController.signup,
  OtpVerify: recuiterController.otp,
  Login: recuiterController.login,
  Getall: recuiterController.getall,
  UpdateStatus: recuiterController.updateStatus,
  Approval: recuiterController.updateApproval,
  GetStatus: recuiterController.getStatus,
  GetReports: recuiterController.getRecruiterReports,
})

grpcServer();

import { service } from "../services/recruiterService";
import { Repository } from '../repository/recruiterRepository'

export const recuiterController = {
  signup: async (call: any, callback: any) => {
    try {
      const data = call.request
      const response = await service.register(data)
      if (response?.success) {
        callback(null, { success: true, msg: "otp sended", otp: response.otp, data: response.user_data });
      } else {
        callback(null, { success: false, msg: "email already exist" });
      }
    } catch (err) {
      console.log("ERROR:", err,);
    }
  },

  otp: async (call: any, callback: any) => {
    try {
      const body = call.request;
      const otp = body.otp;
      const userdata = body.userdata;
      const enterOtp = body.enterOtp;
      const otpResponse = await service.verifyOtp(enterOtp, otp, userdata);
      callback(null, otpResponse);
    } catch (err) {
      callback(err);
    }
  },

  login: async (call: any, callback: any) => {
    try {
      const { password, email } = call.request
      const userdata = {
        email,
        password
      }
      const loginResponse = await service.verifyLogin(userdata)
      callback(null, loginResponse)
    } catch (err) {
      callback(err);
    }
  },

  getall: async (call: any, callback: any) => {
    try {
      let users = await Repository.getall()
      const response = {
        users: users
      };
      callback(null, response)
    } catch (err) {
      callback(err);
    }
  },

  updateStatus: async (call: any, callback: any) => {
    try {
      let user = await Repository.findByEmail(call.request.email)
      let update, users;
      if (user) {
        update = await Repository.updateStatus(user);
      }
      if (update) {
        users = await Repository.getall()
      }
      const response = {
        users: users
      };
      callback(null, response)
    } catch (err) {
      callback(err);
    }
  },

  updateApproval: async (call: any, callback: any) => {
    try {
      let user = await Repository.findByEmail(call.request.email)
      let update, users;

      if (user) {
        update = await Repository.updateApprove(user);
      }
      if (update) {
        users = await Repository.getall()
      }
      const response = {
        users: users
      };
      callback(null, response)
    } catch (err) {
      callback(err);
    }
  },

  getStatus: async (call: any, callback: any) => {
    try {
      const { userId } = call.request;
      let response = await Repository.getStatus(userId)
      callback(null, response)
    } catch (err) {
      callback(err)
    }
  },

  getRecruiterReports: async (call: any, callback: any) => {
    try {
      const currentYear = new Date().getFullYear()
      const month = new Date().getMonth()
      let response = await service.getChartDetails(currentYear, month)
      callback(null, response)
    } catch (err) {
      callback(err)
    }
  },

}

import twilio from "twilio";
import User from "../models/user.model.js";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();
const client = twilio(process.env.account_sid, process.env.auth_token);

const callCronJobs = () => {
  // cron job runs every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    try {
      const users = await User.find({ priority: { $ne: null } }).sort({
        priority: 1,
      });

      for (const user of users) {
        const phoneNumber = "+91" + user.phone_number;
        const call = await client.calls.create({
          url: process.env.url_to_twilio_xml,
          to: phoneNumber,
          from: process.env.twilio_phone_number,
        });
        console.log(call);
        client
          .calls(call.sid)
          .fetch()
          .then((call) => {
            if (call.status === "completed") {
              user.priority = null;
              user.save();
            }
          });
      }
    } catch (err) {
      console.error("Cron job error:", err);
    }
    console.log("Cron job executed successfully");
  });
};

export default callCronJobs;

// client.calls(sid)
// .fetch()
// .then(call => console.log(call));

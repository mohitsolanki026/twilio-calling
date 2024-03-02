import corn from "node-cron";
import taskModel from "../models/task.model.js";
import userModel from "../models/user.model.js";


const taskCronJobs = () => {
  // per minute cron job
  corn.schedule("* * * * *", async() => {
    // corn.schedule("0 0 * * *", async () => {
    try{
      console.log("Cron job executed successfully");
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
        const tasks = await taskModel.find({
          deleted_at: null,
          status: { $in: ["TODO", "IN_PROGRESS"] },
        });
    
        tasks.forEach(async (task) => {
          if (task.due_date.toDateString() === today.toDateString()) {
            task.priority = 0;
          } else if (
            task.due_date.toDateString() === tomorrow.toDateString() ||
            task.due_date.toDateString() === dayAfterTomorrow.toDateString()
          ) {
            task.priority = 1;
          } else if (
            task.due_date.toDateString() === dayAfterTomorrow.toDateString() ||
            task.due_date.toDateString() === dayAfterTomorrow.toDateString()
          ) {
            task.priority = 2;
          } else {
            task.priority = 3;
          }
    
          await task.save();
        });
    
        const totalTask = await taskModel.countDocuments({
          deleted_at: null,
          status: { $in: ["TODO", "IN_PROGRESS"] },
          due_date: { $lt: new Date() },
        });
    
        const users = await userModel.find();
    
        const userOverdueTaskCounts = [];
    
        for (const user of users) {
          const overdueTasksCount = await taskModel.countDocuments({
            deleted_at: null,
            status: { $in: ["TODO", "IN_PROGRESS"] },
            user_id: user._id,
            due_date: { $lt: new Date() },
          });
          if (overdueTasksCount > 0) {
            userOverdueTaskCounts.push({
              userId: user._id,
              count: overdueTasksCount,
            });
          }
          
        }
    
        userOverdueTaskCounts.sort((a, b) => b.count - a.count);
    
        userOverdueTaskCounts.forEach((userData, index) => {
          const user = users.find((user) => user._id.equals(userData.userId));
          if (user) {
            user.priority = index;
          }
        });
    
        await Promise.all(users.map((user) => user.save()));
    }
    catch(err){
      console.log("Cron job error:", err);
    }
  });
};

export default taskCronJobs;
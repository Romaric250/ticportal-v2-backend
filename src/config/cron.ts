import { CronJob } from "cron";
import https from "https";

const job = new CronJob("*/1 * * * *", () => {
  https
    .get(`${process.env.API_URL}/health`, (res) => {
      if (res.statusCode === 200) console.log("Get request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});


export default job;

// CRON JOB EXPLANATION:
// This cron job is scheduled to run every 14 minutes. It sends a GET request to the health check endpoint of the API.
// If the request is successful (status code 200), it logs a success message. If it fails, it logs the status code.
// Additionally, it handles any errors that occur while sending the request.


//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES
//* 15 * * * * * - Every 15 seconds
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM on the 15th day of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour
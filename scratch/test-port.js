const http = require("http");

http.get("http://localhost:3000/api/teachers?approved=false", (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("====================================");
    console.log("LOCAL PORT 3000 API TEST:");
    console.log("STATUS CODE:", res.statusCode);
    console.log("RESPONSE BODY:", data);
    console.log("====================================");
  });
}).on("error", (err) => {
  console.log("====================================");
  console.log("HTTP TEST FAILED:", err.message);
  console.log("====================================");
});

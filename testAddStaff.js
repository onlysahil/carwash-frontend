import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDkxNDg5NywiZXhwIjoxNzY1MDAxMjk3fQ.eHNPIb2QPracG40KhoIlNty848EHH4Gpq7uPG1dZeX0";

axios.post(
  "https://dentiled-halley-asyndetically.ngrok-free.dev/users/staff",
  {
    name: "Test Staff",
    email: "teststaff@example.com",
    password: "123456",
    role: "staff"
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }
)
.then(res => console.log("SUCCESS:", res.data))
.catch(err => console.error("ERROR:", err.response?.data));


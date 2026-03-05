const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: "postgresql://postgres:@.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
})

app.get("/", (req, res) => {
  res.send("API RUNNING")
})

app.get("/validate", async (req, res) => {
  const { key } = req.query

  if (!key) {
    return res.send("print('NO KEY')")
  }

  try {
    const result = await pool.query(
      "SELECT * FROM keys WHERE key=$1",
      [key]
    )

    if (result.rows.length === 0) {
      return res.send("print('KEY NOT FOUND')")
    }

    res.send("print('KEY VALID')")
  } catch (err) {
    console.error(err)
    res.send("print('DATABASE ERROR')")
  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})

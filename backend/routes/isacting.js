var express = require("express");
var router = express.Router();
const db = require("../db");

router.get("/:year", async (req, res) => {
  const data = await db.query(
    "SELECT actor.*, array_to_string(array_agg(distinct award.awardname), ',') as awards, array_to_string(array_agg(distinct film.name), ',') as films FROM actor LEFT JOIN acts ON actor.actorid = acts.actorid LEFT JOIN film ON film.filmid = acts.filmid LEFT JOIN award ON award.actorid = actor.actorid WHERE actor.startyear <= $1 GROUP BY actor.actorid",
    [req.params.year]
  );
  res.json({ data: data.rows });
});

module.exports = router;

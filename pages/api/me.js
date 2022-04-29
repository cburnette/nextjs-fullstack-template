import { getSession } from "next-auth/react"
import { neo4jDriver } from './_neo4j'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).send({ error: "Unauthorized" })
  }

  switch (req.method) {
    case 'GET':
      let neo4jSession
      try {
        neo4jSession = neo4jDriver.session()

        const query = `match (u:User {email: $userEmail}) return u`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {userEmail: session.user.email}))

        const record = result.records[0]
        const u = record.get('u')
        
        res.status(200).json({ u });
      } catch(error) {
        res.status(500).send()
      } finally {
        await neo4jSession.close()
      }
      break
    default:
      res.status(405).send()
  }
}
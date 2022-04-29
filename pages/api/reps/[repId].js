import { getSession } from "next-auth/react"
import { neo4jDriver } from '../_neo4j'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).send({ error: "Unauthorized" })
  }

  const currUser = session.user.email
  let neo4jSession

  switch (req.method) {
    case 'GET':
      try {
        const { repId } = req.query
        neo4jSession = neo4jDriver.session()
        const query = `match (u:User {email: $currUser})
                       match (r:Rep {id: $id, orgId: u.orgId})
                       return r`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {currUser: currUser, id: repId}))

        const record = result.records[0]
        
        if(record) {
          const r = record.get('r')
          res.status(200).json(r.properties)
        } else {
          res.status(404).send()
        }
      } catch(error) {
        console.log(error)
        res.status(500).send()
      } finally {
        await neo4jSession.close()
      }
      break
    default:
      res.status(405).send()
  }
}
import { getSession } from "next-auth/react"
import { neo4jDriver } from './_neo4j'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).send({ error: "Unauthorized" })
  }

  const currUser = session.user.email
  let neo4jSession

  switch (req.method) {
    case 'GET': //get the org for the current user
      try {
        neo4jSession = neo4jDriver.session()
        const query = `match (u:User {email: $currUser})-[:BELONGS_TO]->(o:Org)
                       return o`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {currUser: currUser}))
        const record = result.records[0]
        const org = record.get('o')    
        res.status(200).json(org.properties);
      } catch(error) {
        console.log(error)
        res.status(500).send()
      } finally {
        await neo4jSession.close()
      }
      break
    case 'PUT':    
      try {
        neo4jSession = neo4jDriver.session()
        const query = `match (u:User {email: $currUser, orgAdmin: true})-[:BELONGS_TO]->(o:Org)
                       set o += { 
                                  fiscalYearStartMonth: $fiscalYearStartMonth, 
                                  period: $period, 
                                  modifiedAt: datetime.transaction() 
                                }
                       return o`
        const result = await neo4jSession.writeTransaction(tx => tx.run(query, {currUser: currUser, 
                                                                                fiscalYearStartMonth: req.body.fiscalYearStartMonth, 
                                                                                period: req.body.period
                                                                               }))
        const record = result.records[0]
        const org = record.get('o')    
        res.status(200).json(org.properties);
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
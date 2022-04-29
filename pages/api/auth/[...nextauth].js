import { Neo4jAdapter } from "@next-auth/neo4j-adapter"
import { neo4jDriver } from '../_neo4j'
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import Haikunator from 'haikunator'

const neo4jSession = neo4jDriver.session()

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (isNewUser) {
        const neo4jSessionForCallback = neo4jDriver.session()
        try {
          console.log('creating new organization for first time user')
          const haikunator = new Haikunator()
          const orgName = haikunator.haikunate()
          console.log(`new organization name: ${orgName}`)
          
          let query = ` match (u:User {email: $userEmail})
                        create (u)
                                -[:BELONGS_TO {createdAt: datetime.transaction()}]
                                ->(o:Org {
                                          name: $newOrgName, 
                                          createdAt: datetime.transaction(), 
                                          id: apoc.create.uuid(),
                                          fiscalYearStartMonth: 1,
                                          period: 'quarter'
                                        })
                        set u.orgAdmin = true
                        return u`
          let result = await neo4jSessionForCallback.writeTransaction(tx => tx.run(query, {userEmail: user.email, newOrgName: orgName}))
          let record = result.records[0]
          const u = record.get('u') 

          console.log('Created new user')
        } catch(error) {
          console.log(`Error creating new user: ${error}`)
        } finally {
          neo4jSessionForCallback.close()
        }
      } else {
        //console.log('Logged in existing user')
      }
      return token
    },
  },
  adapter: Neo4jAdapter(neo4jSession),
  theme: {
    colorScheme: "light",
    brandColor: "#fff",
    logo: "/logo.svg"
  }
})
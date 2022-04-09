import 'reflect-metadata'
import path from 'path'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

async function main() {
    const schema = await buildSchema({
        resolvers: [],
        emitSchemaFile: path.resolve(__dirname, 'schema.gql')
    })

    const server = new ApolloServer({
        schema,
    })

    const { url } = await server.listen()

    console.log(url)
}

main()
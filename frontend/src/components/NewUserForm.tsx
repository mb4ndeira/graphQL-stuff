import { gql, useMutation } from "@apollo/client";
import { useState, FormEvent } from "react"

import { GET_USER } from "../App";
import { client } from "../lib/apollo";

const CREATE_USER = gql`
    mutation ($name: String!) { 
        createUser(name: $name) {
            ID
            name
        }
    }
`;

export function NewUserForm() {
    const [name, setName] = useState('')
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER)

    const handleCreateUser = async (event: FormEvent) => {
        event.preventDefault()  
        
        if(!name) return

        await createUser({ 
            variables: { name }, 
            // refetchQueries: [GET_USER], // this line tells Apollo to refetch users query upon the completion of this mutation
            // the block bellow adds the created user to existing cache of users
            update: (cache, { data: { createUser } }) => { 
                const { users } = client.readQuery({ query: GET_USER })

                cache.writeQuery({
                    query: GET_USER,
                    data: { 
                        users: [
                           ...users,
                           createUser
                        ]
                    }
                })
            }
        })
    }

    return (
        <form onSubmit={handleCreateUser}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <button type="submit">Enviar</button>
        </form>
    )
}
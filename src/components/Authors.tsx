import React, { useEffect, useState } from 'react'
import { useSDK } from '@contentful/react-apps-toolkit'
import { Flex, EntryCard, Heading } from '@contentful/f36-components'

const URL = 'https://graphql.contentful.com/content/v1/spaces/';

export interface Author {
    name:       string;
    linkedFrom: LinkedFrom;
}

export interface LinkedFrom {
    dailyEntryCollection: DailyEntryCollection;
}

export interface DailyEntryCollection {
    total: number;
}

const Authors = () => {
    const sdk = useSDK();
    const [authors, setAuthors] = useState<Author[] | null>();

    const fetchEntries = async (apiKey:string) => {
        const query = `
        {
            authorCollection{
              items {
                name
                linkedFrom{
                  dailyEntryCollection{
                    total
                  }
                }
              }
            }
          }
        `
        const spaceId = sdk.ids.space;
        const environmentId = sdk.ids.environment

        const url = URL + spaceId + '/environments/'+environmentId

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({query})
        })

        if(response.ok){

            const result = await response.json();
            return result.data.authorCollection.items as Author[];
        }
        return []
    }

    useEffect(()=>{
        const {apiKey} = sdk.parameters.installation;
        fetchEntries(apiKey).then((data:Author[])=>{
            if(data){
                setAuthors(data)
            }
        })
    })

    return (
        <Flex flexDirection='column' justifyContent='space-around'>
            <Heading>Authors</Heading>
            {
                authors && authors.map((entry:Author, i:number)=>(
                    <EntryCard 
                        key={i}
                        contentType='Authors'
                        title={entry.name}
                        description={`published entries: ${entry.linkedFrom.dailyEntryCollection.total}`}
                    />
                ))
            }
        </Flex>
    )
}

export default Authors;
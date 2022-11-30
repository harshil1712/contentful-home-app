import React, { useEffect, useState } from 'react'
import { useSDK } from '@contentful/react-apps-toolkit'
import { Flex, EntryCard, Heading, Box } from '@contentful/f36-components'

const URL = 'https://graphql.contentful.com/content/v1/spaces/';

export interface Entry {
    sys:    Sys;
    title:  string;
    author: Author;
}

export interface Author {
    name: string;
}

export interface Sys {
    id:               string;
    publishedVersion: null;
}

const Entries = () => {
    const sdk = useSDK();
    const [publishedEntries, setPublishedEntries] = useState<Entry[] | null>();
    const [unpublishedEntries, setUnpublishedEntries] = useState<Entry[] | null>();

    const fetchEntries = async (apiKey:string) => {
        const query = `
        {
            dailyEntryCollection(preview: true){
              items {
                sys {
                  id
                  publishedVersion
                }
                title
                author {
                  name
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
            const unpublishedEntries = result.data.dailyEntryCollection.items.filter((item: Entry) => !item.sys.publishedVersion) as Entry[];
            const publishedEntries = result.data.dailyEntryCollection.items.filter((item: Entry) => item.sys.publishedVersion) as Entry[];
            return {unpublishedEntries, publishedEntries};
        }
        return null;
    }

    useEffect(()=>{
        const {apiKey} = sdk.parameters.installation;
        fetchEntries(apiKey).then((data)=>{
            if(data){
                const {unpublishedEntries, publishedEntries} = data;
                setPublishedEntries(publishedEntries)
                setUnpublishedEntries(unpublishedEntries);
            }
        })
    })

    return (
            <Flex flexDirection='column' flexGrow={1}>
                <Box margin="spacingS">
                    <Heading>Unpublished</Heading>
                    {
                        unpublishedEntries && unpublishedEntries.map((entry:Entry)=>(
                            <EntryCard 
                                key={entry.sys.id}
                                status='draft'
                                contentType='Daily Entry'
                                title={entry.title}
                                description={`by: ${entry.author.name}`}
                                margin='spacingS'
                            />
                        ))
                    }
                </Box>
                <Box margin="spacingS">
                    <Heading>Published</Heading>
                    {
                        publishedEntries && publishedEntries.map((entry:Entry)=>(
                            <EntryCard 
                                key={entry.sys.id}
                                status='published'
                                contentType='Daily Entry'
                                title={entry.title}
                                description={`by: ${entry.author.name}`}
                                margin='spacingS'
                            />
                        ))
                    }
                </Box>
            </Flex>
        )
}

export default Entries;
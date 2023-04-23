// import { NextApiRequest, NextApiResponse } from 'next';
// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'http://localhost:4000/graphql',
//   cache: new InMemoryCache(),
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     try {
//       const { data } = await client.query({
//         query: gql`
//           query {
//             documentInfos {
//               id
//               name
//               url
//               type
//               xpath
//               branch
//             }
//           }
//         `,
//       });
//       res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const { name, url, type, xpath, branch } = req.body;
//       const { data } = await client.mutate({
//         mutation: gql`
//           mutation ($name: String!, $url: String!, $type: String!, $xpath: String, $branch: String) {
//             createDocumentInfo(name: $name, url: $url, type: $type, xpath: $xpath, branch: $branch) {
//               id
//               name
//               url
//               type
//               xpath
//               branch
//             }
//           }
//         `,
//         variables: { name, url, type, xpath, branch },
//         update(cache, { data: { createDocumentInfo } }) {
//           const existingDocumentInfos = cache.readQuery<{ documentInfos: DocumentInfo[] }>({
//             query: gql`
//               query {
//                 documentInfos {
//                   id
//                   name
//                   url
//                   type
//                   xpath
//                   branch
//                 }
//               }
//             `,
//           });
//           if (existingDocumentInfos) {
//             cache.writeQuery({
//               query: gql`
//                 query {
//                   documentInfos {
//                     id
//                     name
//                     url
//                     type
//                     xpath
//                     branch
//                   }
//                 }
//               `,
//               data: { documentInfos: [...existingDocumentInfos.documentInfos, createDocumentInfo] },
//             });
//           }
//         },
//       });
//       res.status(201).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else if (req.method === 'PUT') {
//     try {
//       const { id, name, url, type, xpath, branch } = req.body;
//       const { data } = await client.mutate({
//         mutation: gql`
//           mutation ($id: String!, $name: String, $url: String, $type: String, $xpath: String, $branch: String) {
//             updateDocumentInfo(id: $id, name: $name, url: $url, type: $type, xpath: $xpath, branch: $branch) {
//               id
//               name
//               url
//               type
//               xpath
//               branch
//             }
//           }
//         `,
//         variables: { id, name, url, type, xpath, branch },
//         update(cache, { data: { updateDocumentInfo } }) {
//           cache.modify({
//             fields: {
//               documentInfos(existingDocumentInfos = [], { readField }) {
//                 const updatedDocumentInfo = cache.writeFragment({
//                   data: updateDocumentInfo,
//                   fragment: gql`
//                     fragment DocumentInfoFields on DocumentInfo {
//                       id
//                       name
//                       url
//                       type
//                       xpath
//                       branch
//                     }
//                   `,
//                 });
//                 return existingDocumentInfos.map((docInfo: DocumentInfo) =>
//                   readField('id', docInfo) === updateDocumentInfo.id ? updatedDocumentInfo : docInfo
//                 );
//               },
//             },
//           });
//         },
//       });
//       res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else if (req.method === 'DELETE') {
//     try {
//       const { id } = req.body;
//       const { data } = await client.mutate({
//         mutation: gql`
//           mutation ($id: String!) {
//             deleteDocumentInfo(id: $id) {
//               id
//               name
//               url
//               type
//               xpath
//               branch
//             }
//           }
//         `,
//         variables: { id },
//         update(cache, { data: { deleteDocumentInfo } }) {
//           const existingDocumentInfos = cache.readQuery<{ documentInfos: DocumentInfo[] }>({
//             query: gql`
//               query {
//                 documentInfos {
//                   id
//                   name
//                   url
//                   type
//                   xpath
//                   branch
//                 }
//               }
//             `,
//           });
//           if (existingDocumentInfos) {
//             cache.writeQuery({
//               query: gql`
//                 query {
//                   documentInfos {
//                     id
//                     name
//                     url
//                     type
//                     xpath
//                     branch
//                   }
//                 }
//               `,
//               data: {
//                 documentInfos: existingDocumentInfos.documentInfos.filter((docInfo: DocumentInfo) => docInfo.id !== deleteDocumentInfo.id),
//               },
//             });
//           }
//         },
//       });
//       res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }
// }

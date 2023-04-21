# Nema ChatBot

To run this demo, you need to have:

1. A Pinecone account. If you don't have one, you can sign up for free at [pinecone.io](https://www.pinecone.io).
2. An OpenAI account. If you don't have one, you can sign up for free at [openai.com](https://www.openai.com).
3. An Ably account. If you don't have one, you can sign up for free at [ably.io](https://www.ably.io).
4. A FingerprintJS account. If you don't have one, you can sign up for free at [fingerprintjs.com](https://www.fingerprintjs.com).
5. A CockroachDB account. If you don't have one, you can sign up for free at [cockroachlabs.com](https://www.cockroachlabs.com).

## Setup

1. Clone this repository

```bash
git clone https://github.com/RobinNagpal/nema-bot.git
```

2. Create your Pinecone, OpenAI, Ably, FingerprintJS and Cockroach accounts and get your API keys

3. Create your Pinecone index

### Nema-Server

1. Install dependencies

```bash
cd nema-server
npm install
```

2. Create a `.env` file in nema-server and add your database url:

```
DATABASE_URL=...
```

3. Prisma Migration

```bash
npx prisma migrate dev
npx prisma studio
```

4. Graphql Server

Open a new terminal and run the below command:

```bash
cd nema-server
npm run dev
```

### Nema-Client

1. Install dependencies

```bash
cd nema-client
npm install
```

2. Create a `.env` file in nema-client and add your API keys:

```
OPENAI_API_KEY=...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX_NAME=...
DATABASE_URL=...
ABLY_API_KEY=...
FINGERPRINTJS_API_KEY=...
API_ROOT="http://localhost:3000"
```

## Start the development server

```bash
npm run dev
```

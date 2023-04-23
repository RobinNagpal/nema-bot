import { useQuery } from '@apollo/client';
import { DOCUMENT_INFOS } from '../lib/graphql/queries';
import Table from './documentsTable';

const Docs = () => {
  const { loading, error, data } = useQuery(DOCUMENT_INFOS);
  if (loading) {
    console.log('loading');
  }
  if (error) {
    console.log('error');
  }
  console.log(data);

  return (
    <div>
      <main>
        <h1 className="text-4xl flex justify-center m-5">Documents List</h1>
        <Table />
      </main>
    </div>
  );
};

export default Docs;

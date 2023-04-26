import DetailsContainer from 'components/core/details/DetailsContainer';
import DetailsTextField from 'components/core/details/DetailsTextField';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { useDocumentInfoQuery } from 'graphql/generated/generated-types';
import { useRouter } from 'next/router';

export default function ViewDocumentInfo() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useDocumentInfoQuery({ variables: { id: id as string } });
  return (
    <DefaultLayout>
      <DetailsContainer heading={'Document Details'}>
        <DetailsTextField label={'Id'} value={data?.documentInfo.id} />
        <DetailsTextField label={'Name'} value={data?.documentInfo.name} />
        <DetailsTextField label={'Url'} value={data?.documentInfo.url} />
        <DetailsTextField label={'Type'} value={data?.documentInfo.type} />
        <DetailsTextField label={'Details'} value={JSON.stringify(data?.documentInfo.details || {})} />
      </DetailsContainer>
    </DefaultLayout>
  );
}

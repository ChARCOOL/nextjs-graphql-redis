import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GetServerSideProps } from 'next';
import React from 'react';
import client from '../modules/apolloClient';
import uniq from 'lodash/uniq';
import startCase from 'lodash/startCase';
import { SubmissionsQuery } from '../generated/graphql';

interface Props {
  submissionData: SubmissionsQuery | null;
  submissionError: ApolloError | null;
  isLoadingSubmission: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data, error, loading } = await client.query<SubmissionsQuery>({
    query: gql`
      query Submissions {
        submissions {
          id
          submittedAt
          data
        }
      }
    `,
  });

  return {
    props: {
      submissionData: data ?? null,
      submissionError: error ?? null,
      isLoadingSubmission: loading,
    },
  };
};

const Home = ({
  submissionData,
  submissionError,
  isLoadingSubmission,
}: Props) => {
  if (isLoadingSubmission) {
    <div>Loading...</div>;
  }

  console.log(submissionData);

  const [generateSubmission, { data, error, loading }] = useMutation(
    gql`
      mutation GenerateSubmissions($count: Int!) {
        queueSubmissionGeneration(count: $count)
      }
    `,
    { variables: { count: 10 } }
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'submittedAt', headerName: 'Submitted At' },
    ...uniq(
      (submissionData?.submissions || []).flatMap((submission) => {
        const dataKeys = Object.keys(submission.data);

        return dataKeys.map((key) => ({
          field: key,
          headerName: startCase(key),
          valueGetter: (params: GridValueGetterParams) => params.row.data[key],
        }));
      })
    ),
  ];

  return (
    <Wrapper>
      <Toolbar>
        <Button onClick={() => generateSubmission()}>
          Generate Submissions
        </Button>
      </Toolbar>
      <DataGrid
        rows={submissionData?.submissions || []}
        columns={columns}
        disableSelectionOnClick
      />
    </Wrapper>
  );
};

const Toolbar = styled.div`
  background: #eee;
  display: flex;
  justify-content: flex-end;
  padding: 15px;
`;

const Button = styled.button`
  background: black;
  color: white;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

export default Home;

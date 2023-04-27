import React from 'react';
import styled from 'styled-components';

interface DetailsTextFieldProps {
  label: string;
  value?: string;
}

const Container = styled.div`
  --tw-text-opacity: 1;
  --tw-bg-opacity: 1;
  --tw-border-opacity: 1;
`;

const Label = styled.dt`
  color: var(--text-color);
`;

const Value = styled.dd`
  color: var(--text-color);
`;

export default function DetailsTextField({ label, value }: DetailsTextFieldProps) {
  return (
    <Container className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <Label className="text-sm font-medium leading-6">{label}</Label>
      <Value className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{value || '-'}</Value>
    </Container>
  );
}

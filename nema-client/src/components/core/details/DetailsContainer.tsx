import React from 'react';
import styled from 'styled-components';

export interface DetailsContainerProps {
  heading: string;
  infoText?: string;
  children: React.ReactNode;
}

const Container = styled.div`
  --tw-text-opacity: 1;
  --tw-bg-opacity: 1;
  --tw-border-opacity: 1;
  color: var(--text-color);
  background-color: var(--bg-color);
`;

const Heading = styled.h2`
  color: var(--heading-color);
`;

const InfoText = styled.p`
  color: var(--text-color);
`;

const BorderDiv = styled.div`
  border-color: var(--border-color);
`;

const Divider = styled.div`
  border-color: var(--border-color);
`;

export default function DetailsContainer(props: DetailsContainerProps) {
  return (
    <Container>
      <div className="px-4 sm:px-0">
        {props.heading && <Heading className="text-base font-semibold leading-7">{props.heading}</Heading>}
        {props.infoText && <InfoText className="mt-1 text-sm leading-6">{props.infoText}</InfoText>}
      </div>
      <BorderDiv className="mt-6 border-t">
        <Divider className="divide-y">{props.children}</Divider>
      </BorderDiv>
    </Container>
  );
}

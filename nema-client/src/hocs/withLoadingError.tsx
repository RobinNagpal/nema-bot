import Loading from 'components/core/Loading';
import React from 'react';

interface WithLoadingErrorProps {
  loading: boolean;
  error: Error | undefined;
}

export const withLoadingError = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P & WithLoadingErrorProps> => {
  return function WithLoadingErrorWrapper({ loading, error, ...props }: WithLoadingErrorProps) {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };
};

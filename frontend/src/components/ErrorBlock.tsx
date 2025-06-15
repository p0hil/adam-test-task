import React from 'react';

type Props = {
    error?: string;
};

export const ErrorBlock: React.FC<Props> = ({ error }) => {
    if (!error) {
        return <></>;
    }

    return (
        <div className="alert alert-danger">{error}</div>
    )
}

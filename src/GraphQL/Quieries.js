import { gql } from '@apollo/client';

export const LOAD_TRANSACTION = gql`
  query ($first: Int, $address: Bytes) {
    transactionEntities(
      first: $first
      orderBy: time
      orderDirection: desc
      where: { address: $address }
    ) {
      id
      type
      address
      amount
      time
    }
  }
`;

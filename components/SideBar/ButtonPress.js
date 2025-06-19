import React from 'react';
import gql from 'graphql-tag';
import {GET_PRODUCT_PAGINTION} from '../../graphql/Queries/Product';

const ButtonPress = () => {
  const [getProduct, {loading, data}] = useLazyQuery(GET_PRODUCT_PAGINTION);
  const rr = useLazyQuery(GET_PRODUCT_PAGINTION);

  if (loading) return <p>Loading ...</p>;
  if (data) {
    console.log('getProduct', data.products.data);
    console.log('getProduct', rr[0]);
  }

  return (
    <>
      <div>
        <button onClick={() => getProduct({variables: {page: 1, pageSize: 5}})}>
          Click
        </button>
        {data &&
          data.products.data &&
          data.products.data.map((c, i) => <div key={i}>{c.name}</div>)}
      </div>
    </>
  );
};
export default ButtonPress;

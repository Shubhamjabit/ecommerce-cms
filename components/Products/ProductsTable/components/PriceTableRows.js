function PriceTableRows({
  pricerowsData,
  deletePriceTableRows,
  handlePriceChange,
}) {
  return pricerowsData.map((data, index) => {
    const {quantity, price} = data;
    return (
      <tr key={index}>
        <td>
          <input
            type="number"
            value={quantity}
            onChange={(evnt) => handlePriceChange(index, evnt)}
            name="quantity"
            className="form-control"
            placeholder="Enter Product Quantity"
          />
        </td>
        <td>
          <input
            type="number"
            value={price}
            onChange={(evnt) => handlePriceChange(index, evnt)}
            name="price"
            className="form-control"
            placeholder="Enter Product Price"
          />{' '}
        </td>

        <td>
          <button
            className="btn btn-outline-danger"
            onClick={() => deletePriceTableRows(index)}
          >
            x
          </button>
        </td>
      </tr>
    );
  });
}
export default PriceTableRows;

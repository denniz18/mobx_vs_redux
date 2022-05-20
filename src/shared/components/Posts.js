export default function Posts({
  data,
  onRemove = console.log,
  onEdit = console.log,
}) {
  return (
    <ul>
      {data.map((dataItem) => (
        <li key={dataItem.id}>
          <h5>{dataItem.title}</h5>
          {dataItem.authorId}
          <br />
          <textarea
            value={dataItem.text}
            onChange={(e) => {
              onEdit(dataItem.id, e.target.value);
            }}
          />
          <button type="button" onClick={() => onRemove(dataItem.id)}>
            remove
          </button>
        </li>
      ))}
    </ul>
  );
}

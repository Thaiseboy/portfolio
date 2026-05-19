export default function DataState({
  loading,
  items,
  renderLoading,
  renderItems,
  emptyMessage,
  emptyClassName = "empty-state surface-panel",
}) {
  if (loading) return renderLoading();

  if (items.length > 0) return renderItems(items);

  return (
    <div className={emptyClassName}>
      <p>{emptyMessage}</p>
    </div>
  );
}

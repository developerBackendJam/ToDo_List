import React from 'react';

export default function TodoFilter({
  currentFilter,
  onChangeFilter,
  totalCount,
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  const filters = [
    { id: 'all', label: 'Tất cả', count: totalCount },
    { id: 'active', label: 'Đang làm', count: activeCount },
    { id: 'completed', label: 'Đã xong', count: completedCount },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-pills" role="tablist">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={currentFilter === f.id}
            className={`filter-btn ${currentFilter === f.id ? 'active' : ''}`}
            onClick={() => onChangeFilter(f.id)}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="stats-info">
        <span>
          Còn lại: <strong className="stats-count">{activeCount}</strong> việc
        </span>
        {completedCount > 0 && (
          <button
            type="button"
            className="btn-clear-completed"
            onClick={onClearCompleted}
            title="Dọn dẹp các việc đã hoàn thành"
          >
            Dọn dẹp đã xong ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const [data, setData] = useState<IItem[]>(props.initialData);
    const [sorting, setSorting] = useState<'ASC' | 'DESC'>(props.sorting);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Автофокус на input при начале редактирования
    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    // Сортировка данных по полю id
    const sortedData = [...data].sort((a, b) => {
        return sorting === 'ASC' ? a.id - b.id : b.id - a.id;
    });

    // Начало редактирования — клик по имени
    const handleNameClick = (item: IItem) => {
        setEditingId(item.id);
        setEditValue(item.name);
    };

    // Сохранение по Enter
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        item: IItem,
    ) => {
        if (e.key === 'Enter') {
            setData((prev) =>
                prev.map((el) =>
                    el.id === item.id ? { ...el, name: editValue } : el,
                ),
            );
            setEditingId(null);
        }
        // Отмена по Escape
        if (e.key === 'Escape') {
            setEditingId(null);
            setEditValue('');
        }
    };

    // Переключение сортировки (текущее редактирование сохраняется)
    const handleChangeSorting = () => {
        // Если идёт редактирование — сохраняем текущее состояние
        if (editingId !== null) {
            setData((prev) =>
                prev.map((el) =>
                    el.id === editingId ? { ...el, name: editValue } : el,
                ),
            );
            // editingId остаётся тем же — элемент продолжает редактироваться
        }
        setSorting((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    };

    return (
        <div>
            {/* Кнопка смены сортировки */}
            <button onClick={handleChangeSorting}>Change sorting</button>

            {/* Список элементов */}
            <ul>
                {sortedData.map((item) => (
                    <li key={item.id}>
                        {editingId === item.id ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, item)}
                            />
                        ) : (
                            <span onClick={() => handleNameClick(item)}>
                                {item.name}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

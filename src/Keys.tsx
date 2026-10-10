import { useMemo, useState, KeyboardEvent } from 'react';
import { IItem } from './index';

interface IEditableItemProps {
    item: IItem;
    onSave: (id: number, name: string) => void;
}

function EditableItem({ item, onSave }: IEditableItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(item.name);

    const startEditing = () => {
        setDraft(item.name);
        setIsEditing(true);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSave(item.id, draft);
            setIsEditing(false);
        } else if (event.key === 'Escape') {
            setDraft(item.name);
            setIsEditing(false);
        }
    };

    return (
        <div>
            {isEditing ? (
                <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                />
            ) : (
                <span onClick={startEditing}>{item.name}</span>
            )}
        </div>
    );
}

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const [data, setData] = useState<IItem[]>(props.initialData);

    const sortedData = useMemo(() => {
        const copy = [...data];
        copy.sort((a, b) =>
            props.sorting === 'ASC' ? a.id - b.id : b.id - a.id,
        );
        return copy;
    }, [data, props.sorting]);

    const handleSave = (id: number, name: string) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, name } : item)),
        );
    };

    return (
        <div>
            {sortedData.map((item) => (
                <EditableItem key={item.id} item={item} onSave={handleSave} />
            ))}
        </div>
    );
}

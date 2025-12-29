import React from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const MenuBuilder = ({ items, onChange }) => {
    const addItem = () => {
        onChange([...items, { name: '', description: '', price: '', image: '' }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        onChange(newItems);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            {items.map((item, index) => (
                <div key={index} style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>ITEM {index + 1}</span>
                        <button onClick={() => removeItem(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                        <input
                            placeholder="Item Name"
                            className="input"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                        />
                        <input
                            placeholder="Price"
                            className="input"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                        />
                    </div>

                    <textarea
                        placeholder="Description"
                        className="input"
                        style={{ width: '100%', marginBottom: '0.5rem', minHeight: '60px' }}
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />

                    {/* Simple Image URL input for now */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ImageIcon size={16} color="#64748b" />
                        <input
                            placeholder="Image URL (optional)"
                            className="input"
                            style={{ flex: 1 }}
                            value={item.image}
                            onChange={(e) => updateItem(index, 'image', e.target.value)}
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={addItem}
                className="btn"
                style={{ width: '100%', background: '#eff6ff', color: '#3b82f6', border: '1px dashed #3b82f6' }}
            >
                <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Menu Item
            </button>
        </div>
    );
};

export default MenuBuilder;

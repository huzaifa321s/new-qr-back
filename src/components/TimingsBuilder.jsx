import React from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TimingsBuilder = ({ timings, onChange }) => {
    const updateTiming = (day, field, value) => {
        const newTimings = { ...timings };
        if (!newTimings[day]) newTimings[day] = { isOpen: true, open: '09:00', close: '17:00' };
        newTimings[day][field] = value;
        onChange(newTimings);
    };

    const toggleDay = (day) => {
        const newTimings = { ...timings };
        if (!newTimings[day]) newTimings[day] = { isOpen: true, open: '09:00', close: '17:00' };
        newTimings[day].isOpen = !newTimings[day].isOpen;
        onChange(newTimings);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DAYS.map(day => {
                const timing = timings[day] || { isOpen: true, open: '09:00', close: '17:00' };
                return (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px' }}>
                        <div style={{ width: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={timing.isOpen}
                                onChange={() => toggleDay(day)}
                            />
                            <span style={{ fontSize: '0.9rem', color: timing.isOpen ? '#1e293b' : '#94a3b8' }}>{day}</span>
                        </div>

                        {timing.isOpen && (
                            <>
                                <input
                                    type="time"
                                    value={timing.open}
                                    onChange={(e) => updateTiming(day, 'open', e.target.value)}
                                    className="input"
                                    style={{ padding: '0.25rem', width: 'auto' }}
                                />
                                <span style={{ color: '#64748b' }}>to</span>
                                <input
                                    type="time"
                                    value={timing.close}
                                    onChange={(e) => updateTiming(day, 'close', e.target.value)}
                                    className="input"
                                    style={{ padding: '0.25rem', width: 'auto' }}
                                />
                            </>
                        )}
                        {!timing.isOpen && <span style={{ fontSize: '0.8rem', color: '#ef4444', fontStyle: 'italic' }}>Closed</span>}
                    </div>
                );
            })}
        </div>
    );
};

export default TimingsBuilder;

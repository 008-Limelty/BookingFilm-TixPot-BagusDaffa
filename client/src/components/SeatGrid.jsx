import React from 'react';

const Seat = ({ row, number, status, onSelect }) => {
    if (status === 'gap') return <div className="w-8 h-8 m-1" />;

    const getStatusColor = () => {
        switch (status) {
            case 'available': return 'bg-white/20 hover:bg-white/50 cursor-pointer';
            case 'booked': return 'bg-red-900/40 border border-red-500/20 cursor-not-allowed opacity-60';
            case 'selected': return 'bg-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-110';
            default: return 'bg-white/20';
        }
    };

    return (
        <button
            onClick={() => status !== 'booked' && onSelect(row, number)}
            disabled={status === 'booked'}
            className={`
                w-8 h-8 m-1 rounded-t-lg text-xs font-medium transition-all duration-200
                flex items-center justify-center
                ${getStatusColor()}
            `}
        >
            {status === 'booked' ? '×' : number}
        </button>
    );
};

const SeatGrid = ({ rows, cols, bookedSeats, selectedSeats, onToggleSeat }) => {
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl mb-12 relative">
                <div className="h-2 bg-white/20 rounded-full w-full mb-2 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"></div>
                <div className="text-center text-xs text-white/30 tracking-[0.5em] uppercase">Screen</div>
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none transform perspective-[500px] rotate-x-12 origin-top"></div>
            </div>

            <div className="grid gap-1 mb-8">
                {Array.from({ length: rows }).map((_, rIndex) => {
                    const rowLabel = rowLabels[rIndex];
                    return (
                        <div key={rowLabel} className="flex items-center gap-4">
                            <span className="w-6 text-center text-sm text-muted font-bold">{rowLabel}</span>
                            <div className="flex">
                                {Array.from({ length: cols }).map((_, cIndex) => {
                                    const seatNum = cIndex + 1;

                                    const isBooked = bookedSeats.some(s =>
                                        (s.row === rowLabel || s.seat_row === rowLabel) &&
                                        (s.number === seatNum || s.seat_number === seatNum)
                                    );
                                    const isSelected = selectedSeats.some(s => s.row === rowLabel && s.number === seatNum);

                                    return (
                                        <React.Fragment key={`${rowLabel}-${seatNum}`}>
                                            {/* Aisle gap */}
                                            {cIndex === Math.floor(cols / 2) && <div className="w-8" />}
                                            <Seat
                                                row={rowLabel}
                                                number={seatNum}
                                                status={isBooked ? 'booked' : isSelected ? 'selected' : 'available'}
                                                onSelect={onToggleSeat}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <span className="w-6 text-center text-sm text-muted font-bold">{rowLabel}</span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/20 rounded-t"></div> Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-t shadow-[0_0_10px_rgba(229,9,20,0.5)]"></div> Selected
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-900/40 border border-red-500/20 rounded-t"></div> Sold
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;

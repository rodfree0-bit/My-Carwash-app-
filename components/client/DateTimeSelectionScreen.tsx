import React from 'react';
import { Screen, Order, TeamMember, ToastType } from '../../types';

interface DateTimeSelectionScreenProps {
    selectedOption: 'asap' | 'scheduled';
    setSelectedOption: (option: 'asap' | 'scheduled') => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
    orders: Order[];
    team: TeamMember[];
    navigate: (screen: Screen) => void;
    showToast: (message: string, type: ToastType) => void;
}

export const DateTimeSelectionScreen: React.FC<DateTimeSelectionScreenProps> = ({
    selectedOption,
    setSelectedOption,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    orders,
    team,
    navigate,
    showToast
}) => {
    // Feature flag to hide/show Wash Now option
    const SHOW_WASH_NOW = true;

    // Generate next 14 days starting from today
    const generateDays = () => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Construct local YYYY-MM-DD to avoid UTC shifts
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const localDateString = `${year}-${month}-${day}`;

            days.push({
                date: localDateString,
                dayName: dayNames[date.getDay()],
                dayNumber: date.getDate(),
                month: monthNames[date.getMonth()],
                isToday: i === 0
            });
        }

        return days;
    };

    // Generate time slots based on selected date and washer schedules
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
        // Create date object in local time (00:00:00)
        const selectedDateObj = new Date(sYear, sMonth - 1, sDay);
        const dayOfWeek = selectedDateObj.getDay();

        // Get active washers with schedules
        const activeWashers = team.filter(w => w.role === 'washer' && w.status !== 'Blocked' && w.status !== 'Offline');

        // Collect all available time ranges from washer schedules
        const washerTimeRanges: { start: string; end: string }[] = [];

        activeWashers.forEach(washer => {
            if (washer.schedule && washer.schedule.length > 0) {
                const daySchedule = washer.schedule.find(d => d.day === dayOfWeek && d.enabled);
                if (daySchedule && daySchedule.slots) {
                    washerTimeRanges.push(...daySchedule.slots);
                }
            } else {
                // Default schedule: Mon-Sun 7:00-17:00
                washerTimeRanges.push({ start: "07:00", end: "17:00" });
            }
        });

        // Fallback: If no washers are active or found, assume default business hours
        // This ensures the calendar always shows slots for testing/booking
        if (washerTimeRanges.length === 0) {
            washerTimeRanges.push({ start: "07:00", end: "17:00" });
        }

        // REMOVED: No longer filtering occupied slots - allow all orders
        // const occupiedSlots = orders
        //     .filter(o => o.date === selectedDate && o.status !== 'Cancelled')
        //     .map(o => o.time);

        // Helper to check if time is within any washer's range
        const isTimeInRange = (time: string) => {
            return washerTimeRanges.some(range => time >= range.start && time <= range.end);
        };

        // Determine starting hour
        let startHour = 7;

        // Construct today's local YYYY-MM-DD
        const nowYear = now.getFullYear();
        const nowMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const nowDay = now.getDate().toString().padStart(2, '0');
        const todayLocalString = `${nowYear}-${nowMonth}-${nowDay}`;

        if (selectedDate === todayLocalString) {
            startHour = currentHour + 1;
            if (currentMinute > 30) {
                startHour += 1;
            }
        }

        // Generate slots from startHour to 5 PM (17:00) - filtered by washer ranges only
        for (let hour = startHour; hour <= 17; hour++) {
            const timeSlot00 = `${hour.toString().padStart(2, '0')}:00`;
            const timeSlot30 = `${hour.toString().padStart(2, '0')}:30`;

            // REMOVED occupiedSlots check - allow all time slots
            if (hour <= 17 && isTimeInRange(timeSlot00)) {
                slots.push(timeSlot00);
            }
            if (hour < 17 && isTimeInRange(timeSlot30)) {
                slots.push(timeSlot30);
            }
        }

        return slots;
    };

    const availableDays = generateDays();
    const timeSlots = generateTimeSlots();

    const handleContinue = () => {
        if (selectedOption === 'scheduled') {
            if (!selectedDate) {
                showToast('Please select a date', 'error');
                return;
            }
            if (!selectedTime) {
                showToast('Please select a time', 'error');
                return;
            }
        }
        navigate(Screen.CLIENT_ADDRESS);
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="flex items-center px-4 py-4 border-b border-white/5">
                <button onClick={() => navigate(Screen.CLIENT_SERVICE_SELECT)}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-6">Date & Time</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <p className="text-slate-400 text-sm mb-6">When would you like your wash?</p>

                {/* Date & Time Selection */}
                {/* Service Type Toggle */}
                {SHOW_WASH_NOW && (
                    <div className="flex bg-surface-dark border border-white/10 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setSelectedOption('asap')}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${selectedOption === 'asap'
                                ? 'bg-primary text-black shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">bolt</span>
                            Wash Now
                        </button>
                        <button
                            onClick={() => setSelectedOption('scheduled')}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${selectedOption === 'scheduled'
                                ? 'bg-primary text-black shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            Schedule
                        </button>
                    </div>
                )}

                {/* ASAP Content */}
                {SHOW_WASH_NOW && selectedOption === 'asap' && (
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 text-center animate-fadeIn">
                        <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <span className="material-symbols-outlined text-3xl">bolt</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Wash Now Service</h3>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                            A washer will be dispatched to your location immediately.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full font-bold text-sm border border-amber-500/20">
                            <span className="material-symbols-outlined text-base">timer</span>
                            Est. Arrival: 30-45 min
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                            <span className="text-slate-400">Wash Now Fee</span>
                            <span className="font-bold text-amber-400">+$15.00</span>
                        </div>
                    </div>
                )}

                {/* Scheduled Content */}
                {selectedOption === 'scheduled' && (
                    <div className="space-y-4 animate-fadeIn">
                        {/* Custom 5-Day Calendar */}
                        <div>
                            <label className="block text-sm font-bold mb-3">Select Date</label>
                            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-2 px-2 snap-x">
                                {availableDays.map(day => (
                                    <button
                                        key={day.date}
                                        onClick={() => {
                                            setSelectedDate(day.date);
                                            setSelectedTime(''); // Reset time when date changes
                                        }}
                                        className={`min-w-[70px] p-3 rounded-xl border-2 transition-all flex flex-col items-center snap-start ${selectedDate === day.date
                                            ? 'border-primary bg-primary/20 shadow-blue'
                                            : 'border-white/10 bg-surface-dark hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-xs text-slate-400 mb-1 pointer-events-none">{day.dayName}</span>
                                        <span className="text-xl font-bold pointer-events-none">{day.dayNumber}</span>
                                        <span className="text-[10px] text-slate-500 uppercase pointer-events-none">{day.month}</span>
                                        {day.isToday && (
                                            <span className="text-[10px] text-primary font-bold mt-1">TODAY</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Slots - Only show if date is selected */}
                        {selectedDate && (
                            <div>
                                <label className="block text-sm font-bold mb-2">Select Time</label>
                                {timeSlots.length > 0 ? (
                                    <div className="max-h-[300px] overflow-y-auto pb-4 -mr-2 pr-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`p-3 rounded-lg border-2 transition-all text-sm ${selectedTime === time
                                                        ? 'border-primary bg-primary/10 text-primary font-bold'
                                                        : 'border-white/10 bg-surface-dark hover:border-white/20'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                                        <p className="text-sm text-amber-400">No time slots available for this date. Please select another date.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-background-dark via-background-dark to-transparent z-10">
                <button
                    onClick={handleContinue}
                    style={{ backgroundColor: '#3b82f6' }}
                    className="w-full h-14 rounded-xl font-bold text-lg hover:brightness-90 transition-all text-white shadow-blue"
                >
                    Continue to Address
                </button>
            </div>
        </div>
    );
};

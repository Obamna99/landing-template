'use client';

import React, { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { he } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('he', he);

interface HebrewDatePickerProps {
  value: string; // ISO: YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string; // ISO: YYYY-MM-DD
  max?: string; // ISO: YYYY-MM-DD
  id?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

function parseISO(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DateInput = forwardRef<HTMLInputElement, any>(function DateInput(props, ref) {
  const { value, onClick, onBlur, placeholder, disabled, className, id } = props;

  return (
    <Input
      id={id}
      ref={ref}
      value={value ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      readOnly
      inputMode="none"
      dir="rtl"
      className={className}
      onClick={onClick}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key !== 'Tab' && e.key !== 'Escape' && e.key !== 'Enter') e.preventDefault();
      }}
    />
  );
});

export function HebrewDatePicker({
  value,
  onChange,
  min,
  max,
  id,
  label,
  disabled,
  error,
  required,
}: HebrewDatePickerProps) {
  const rid = useId();
  const inputId = id ?? `hebrew-date-${rid}`;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => parseISO(value));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedDate(parseISO(value));
  }, [value]);

  const minDate = useMemo(() => parseISO(min) ?? undefined, [min]);
  const maxDate = useMemo(() => parseISO(max) ?? undefined, [max]);

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(2020, i, 1).toLocaleDateString('he-IL', { month: 'long' })
      ),
    []
  );

  const years = useMemo(() => {
    const nowY = new Date().getFullYear();
    const start = (minDate?.getFullYear() ?? nowY - 100);
    const end = (maxDate?.getFullYear() ?? nowY + 20);

    const out: number[] = [];
    for (let y = start; y <= end; y++) out.push(y);
    return out;
  }, [minDate, maxDate]);


  // Close on outside click (capture=true works even inside Radix dialogs/popovers)
  useEffect(() => {
    if (!open) return;

    const onPointerDownCapture = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      if (wrapperRef.current?.contains(t)) return;
      if (calendarRef.current?.contains(t)) return;

      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, [open]);

  const handleSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      onChange(toISO(date));
      setOpen(false);
    } else {
      onChange('');
    }
  };

  const CalendarContainer = ({ className, children }: any) => (
    <div ref={calendarRef} className={className} dir="rtl">
      {children}
    </div>
  );

  /**
   * IMPORTANT FIX:
   * Your arrows were “acting flipped” because your header container was dir="rtl".
   * In RTL, CSS grid/flex can visually mirror placement, so the “left button” in code
   * can end up on the RIGHT on screen.
   *
   * Solution: make the header layout LTR (stable), but keep the month text RTL.
   *
   * Desired (Hebrew RTL UX):
   * - LEFT button (‹)  = next month (forward)  -> increaseMonth()
   * - RIGHT button (›) = previous month (back) -> decreaseMonth()
   */
  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
  
    const startOfMonth = (y: number, m: number) => new Date(y, m, 1);
    const endOfMonth = (y: number, m: number) => new Date(y, m + 1, 0);
  
    const canShowMonth = (y: number, m: number) => {
      const start = startOfMonth(y, m);
      const end = endOfMonth(y, m);
  
      if (minDate && end < minDate) return false;
      if (maxDate && start > maxDate) return false;
      return true;
    };
  
    const prevYearDisabled = !canShowMonth(currentYear - 1, currentMonth);
    const nextYearDisabled = !canShowMonth(currentYear + 1, currentMonth);
  
    return (
      <div className="hebrew-dp__header" dir="ltr">
        {/* YEAR ROW (top) */}
        <div className="hebrew-dp__row" dir="ltr">
          <button
            type="button"
            className="hebrew-dp__nav"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeYear(currentYear + 1); // NEXT year (left)
            }}
            disabled={nextYearDisabled}
            aria-label="שנה הבאה"
          >
            ‹
          </button>
  
          <select
            className="hebrew-dp__select"
            dir="rtl" // makes the native dropdown arrow appear on the LEFT
            value={currentYear}
            onChange={(e) => changeYear(Number(e.target.value))}
            aria-label="בחר שנה"
          >
            {years.map((y) => (
              <option key={y} value={y} style={{ direction: 'ltr' }}>
                {y}
              </option>
            ))}
          </select>
  
          <button
            type="button"
            className="hebrew-dp__nav"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeYear(currentYear - 1); // PREV year (right)
            }}
            disabled={prevYearDisabled}
            aria-label="שנה קודמת"
          >
            ›
          </button>
        </div>
  
        {/* MONTH ROW (below) */}
        <div className="hebrew-dp__row" dir="ltr">
          <button
            type="button"
            className="hebrew-dp__nav"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              increaseMonth(); // NEXT month (left)
            }}
            disabled={nextMonthButtonDisabled}
            aria-label="חודש הבא"
          >
            ‹
          </button>
  
          <select
            className="hebrew-dp__select"
            dir="rtl"
            value={currentMonth}
            onChange={(e) => changeMonth(Number(e.target.value))}
            aria-label="בחר חודש"
          >
            {months.map((label, idx) => (
              <option key={label} value={idx} disabled={!canShowMonth(currentYear, idx)}>
                {label}
              </option>
            ))}
          </select>
  
          <button
            type="button"
            className="hebrew-dp__nav"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              decreaseMonth(); // PREV month (right)
            }}
            disabled={prevMonthButtonDisabled}
            aria-label="חודש קודם"
          >
            ›
          </button>
        </div>
      </div>
    );
  };
  


  const inputClassName = `flex h-11 sm:h-12 w-full rounded-md border ${
    error ? 'border-destructive' : 'border-input'
  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation`;

  return (
    <>
      <div className="space-y-2" ref={wrapperRef}>
        {label && (
          <Label htmlFor={inputId} className="text-sm sm:text-base text-right block">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <div className="[&_.react-datepicker-wrapper]:w-full [&_.react-datepicker__input-container]:w-full">
          <DatePicker
            id={inputId}
            selected={selectedDate}
            onChange={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            locale="he"
            dateFormat="dd/MM/yyyy"
            placeholderText="בחר תאריך"
            disabled={disabled}
            open={open}
            onInputClick={() => !disabled && setOpen(true)}
            onFocus={() => !disabled && setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
              if (e.key === 'Enter' || e.key === ' ') setOpen(true);
            }}
            shouldCloseOnSelect
            onClickOutside={() => setOpen(false)}
            showPopperArrow={false}
            popperPlacement="bottom-start"
            popperClassName="hebrew-datepicker-popper"
            calendarClassName="hebrew-datepicker-calendar"
            calendarContainer={CalendarContainer}
            renderCustomHeader={renderCustomHeader}
            fixedHeight
            customInput={<DateInput className={inputClassName} />}
          />
        </div>

        {error && <p className="text-xs sm:text-sm text-destructive text-right">{error}</p>}
      </div>

      <style jsx global>{`
        .hebrew-datepicker-popper {
          z-index: 9999 !important;
        }

        .hebrew-datepicker-calendar {
          direction: rtl !important;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Hide default nav buttons (we use our own compact header) */
        .hebrew-datepicker-calendar .react-datepicker__navigation {
          display: none !important;
        }

        /* Reduce default header padding so it’s not bulky */
        .hebrew-datepicker-calendar .react-datepicker__header {
          padding: 8px 10px 6px 10px !important;
          border-bottom: none !important;
        }

        /* Compact, aligned header */
        .hebrew-datepicker-calendar .hebrew-dp__header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 2px 6px 2px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .hebrew-datepicker-calendar .hebrew-dp__row {
          display: grid;
          grid-template-columns: 34px 1fr 34px;
          align-items: center;
          gap: 8px;
        }

        .hebrew-datepicker-calendar .hebrew-dp__select {
          height: 30px;
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1;
          padding: 0 10px;
          text-align: center;
          outline: none;
        }

        .hebrew-datepicker-calendar .hebrew-dp__select:focus {
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
        }

        .hebrew-datepicker-calendar .hebrew-dp__month {
          text-align: center;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hebrew-datepicker-calendar .hebrew-dp__nav {
          width: 34px;
          height: 30px;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          font-size: 20px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }

        .hebrew-datepicker-calendar .hebrew-dp__nav:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Day rows: keep RTL without row-reverse hacks */
        .hebrew-datepicker-calendar .react-datepicker__day-names,
        .hebrew-datepicker-calendar .react-datepicker__week {
          direction: rtl !important;
        }

        /* Fixed, padded “frame” so the popper never resizes */
        .hebrew-datepicker-calendar {
          width: 300px;             
          min-width: 300px;
          box-sizing: border-box;
          padding: 10px;           
          font-variant-numeric: tabular-nums; /* reduces digit jitter */
        }
  
        /* Make the internal container respect the fixed width */
        .hebrew-datepicker-calendar .react-datepicker__month-container {
          width: 100%;
        }
  
        /* (Optional) make popper reserve the same width too */
        .hebrew-datepicker-popper {
          min-width: 320px;
        }

      `}</style>
    </>
  );
}

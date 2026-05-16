import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { TOKENS } from './Primitives';
import Input from './Input';

interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconType: 'date' | 'time';
}

export default function DateTimeInput({ label, iconType, id, ...props }: DateTimeInputProps) {
  const leftIcon = iconType === 'date' ? <Calendar size={18} /> : <Clock size={18} />;

  const rightElement = (
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none select-none hidden sm:inline-block">
      {iconType === 'date' ? 'Pick' : 'Set'}
    </span>
  );

  return (
    <Input id={id!} label={label} leftIcon={leftIcon} rightElement={rightElement}>
      <input
        id={id}
        type={iconType}
        className={`${TOKENS.inputs.base} ${TOKENS.inputs.iconPadding} pr-12 cursor-pointer font-medium tabular-nums select-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
        {...props}
      />
    </Input>
  );
}
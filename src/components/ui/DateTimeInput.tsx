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

  return (
    // rightElement wurde komplett entfernt
    <Input id={id!} label={label} leftIcon={leftIcon}>
      <input
        id={id}
        type={iconType}
        // !pr-7 ist raus, wir nutzen die volle Breite. 
        // Die native Walzen-Optik und das Desktop-Popup bleiben sauber versteckt.
        className={`${TOKENS.inputs.base} ${TOKENS.inputs.iconPadding} appearance-none bg-transparent cursor-pointer font-medium tabular-nums w-full tracking-tighter text-[13px] sm:tracking-normal sm:text-sm [&::-webkit-calendar-picker-indicator]:hidden`}
        {...props}
      />
    </Input>
  );
}
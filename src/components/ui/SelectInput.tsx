import React from 'react';
import { ChevronDown } from 'lucide-react';
import Input from './Input';
import { TOKENS } from './Primitives';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
}

export default function SelectInput({ label, icon, id, children, ...props }: SelectInputProps) {
  return (
    <Input 
      id={id!} 
      label={label} 
      leftIcon={icon} 
      // Der Chevron wird absolut positioniert, das eigentliche Select darübergelegt
      rightElement={<ChevronDown size={16} className="text-slate-400 pointer-events-none" />}
    >
      <select
        id={id}
        className={`${TOKENS.inputs.base} ${icon ? TOKENS.inputs.iconPadding : 'pl-3 pr-8'} appearance-none cursor-pointer font-medium text-slate-700 bg-transparent relative z-0`}
        {...props}
      >
        {children}
      </select>
    </Input>
  );
}
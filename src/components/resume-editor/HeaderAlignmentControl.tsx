
import React from 'react';
import { HeaderAlignment } from '@/context/ResumeContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

type HeaderAlignmentControlProps = {
  value: HeaderAlignment;
  onChange: (value: HeaderAlignment) => void;
};

const HeaderAlignmentControl = ({ value, onChange }: HeaderAlignmentControlProps) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as HeaderAlignment);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="header-alignment">Header Alignment</Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id="header-alignment" className="w-full">
          <SelectValue placeholder="Select alignment">
            <div className="flex items-center space-x-2">
              {value === 'left' && <><AlignLeft className="h-4 w-4" /> <span>Left Aligned</span></>}
              {value === 'center' && <><AlignCenter className="h-4 w-4" /> <span>Center Aligned</span></>}
              {value === 'right' && <><AlignRight className="h-4 w-4" /> <span>Right Aligned</span></>}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">
            <div className="flex items-center space-x-2">
              <AlignLeft className="h-4 w-4" />
              <span>Left Aligned</span>
            </div>
          </SelectItem>
          <SelectItem value="center">
            <div className="flex items-center space-x-2">
              <AlignCenter className="h-4 w-4" />
              <span>Center Aligned</span>
            </div>
          </SelectItem>
          <SelectItem value="right">
            <div className="flex items-center space-x-2">
              <AlignRight className="h-4 w-4" />
              <span>Right Aligned</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderAlignmentControl;

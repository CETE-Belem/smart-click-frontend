import { ChangeEvent } from "react";

type MaskProps = {
  mask: string;
  magicCharacter?: string;
};

const useMask = ({ magicCharacter = "0", mask }: MaskProps) => {
  /**
   * Put this function into onInput from any HTMLInput Element
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === newValue[i] || mask[i] === magicCharacter) continue;
      if (newValue[i] === undefined) break;
      if (mask[i] !== magicCharacter && mask[i] !== newValue[i]) {
        newValue = newValue.substring(0, i) + mask[i] + newValue.substring(i);
        continue;
      }
    }
    e.target.value = newValue;
  };

  const getMaskedValue = (value: string) => {
    if (!value) return "";
    let newValue = value;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === newValue[i] || mask[i] === magicCharacter) continue;
      if (newValue[i] === undefined) break;
      if (mask[i] !== magicCharacter && mask[i] !== newValue[i]) {
        newValue = newValue.substring(0, i) + mask[i] + newValue.substring(i);
        continue;
      }
    }
    return newValue;
  };

  return {
    handleChange,
    getMaskedValue,
  };
};

export default useMask;

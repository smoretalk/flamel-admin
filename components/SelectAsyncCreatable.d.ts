import { FC } from 'react';
import { AsyncCreatableProps } from 'react-select/async-creatable';
interface SelectProps<Option = unknown, IsMulti extends boolean = false> extends AsyncCreatableProps<Option, IsMulti, any> {
    value: Option;
    onChange?: (selected: unknown) => void;
    variant?: 'default' | 'filter';
    onCreateOption: (option: string) => void;
}
export declare const SelectAsyncCreatable: FC<SelectProps<unknown, boolean>>;
export default SelectAsyncCreatable;

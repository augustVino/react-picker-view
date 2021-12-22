import { PopupProps } from 'antd-mobile/es/components/popup';
import { Item, IListPraviteProps } from './List';
export interface IPickerViewPrivateProps {
    title?: any;
    options: Item[][];
    value?: any[];
    defaultValue?: any[];
    okText?: string;
    visible: boolean;
    cancelText?: string;
    showLine?: boolean;
    separate?: string[];
    popupProps?: PopupProps;
}
interface IProps extends IPickerViewPrivateProps, IListPraviteProps {
    onCancel?: Function;
    onOk?: Function;
    onChange?: Function;
}
declare const PickerViewUI: ({ prefix, title, options, defaultValue, value, onChange, visible, onCancel, onOk, okText, cancelText, showLine, separate, popupProps }: IProps) => any;
export default PickerViewUI;

import React from 'react';
import { IPickerViewPrivateProps } from './picker-view';
import { Item } from './List';
import './index.less';
interface IProps extends IPickerViewPrivateProps {
    onListScroll?: Function;
    onClose: Function;
    onCancel?: Function;
    onChange?: Function;
}
export default class PickerView extends React.Component<IProps> {
    values: any[];
    results: Item[];
    constructor(props: IProps);
    handleOk: () => void;
    handleCancel: () => void;
    handleChange: (values: any[], results: Item[]) => void;
    render(): any;
}
export {};
